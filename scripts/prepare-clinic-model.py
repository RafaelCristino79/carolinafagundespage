"""Run with Blender in background mode. Never modifies the source .blend.

blender --background --disable-autoexec assets/sala_atendimento_infantil.blend \
    --python scripts/prepare-clinic-model.py
"""
import bpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'CUDA'
prefs.refresh_devices()
for device in prefs.devices:
    device.use = device.type == 'CUDA'
scene.cycles.device = 'GPU' if any(d.use for d in prefs.devices) else 'CPU'
print('BAKE: device', scene.cycles.device, flush=True)

# Keep the source camera, lights and complete room during the lighting bake.
camera = scene.camera
meshes = [o for o in bpy.context.view_layer.objects if o.type == 'MESH' and not o.hide_render]
print('BAKE: visible meshes', len(meshes), flush=True)
bpy.ops.object.select_all(action='DESELECT')
for obj in meshes:
    obj.hide_set(False)
    obj.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
bpy.ops.object.convert(target='MESH')
meshes = list(bpy.context.selected_objects)

# Retain each object's procedural coordinates when merging the architecture.
for obj in meshes:
    vertices = obj.data.vertices
    low = [min(v.co[i] for v in vertices) for i in range(3)]
    extent = [max(v.co[i] for v in vertices) - low[i] for i in range(3)]
    attr = obj.data.attributes.new('source_generated', 'FLOAT_VECTOR', 'POINT')
    attr.data.foreach_set('vector', [
        (v.co[i] - low[i]) / extent[i] if extent[i] > 1e-8 else 0
        for v in vertices for i in range(3)
    ])

materials = {slot.material for o in meshes for slot in o.material_slots if slot.material}
for material in materials:
    if not material.use_nodes:
        continue
    tree = material.node_tree
    attr = tree.nodes.new('ShaderNodeAttribute')
    attr.attribute_name = 'source_generated'
    for link in list(tree.links):
        if link.from_node.type == 'TEX_COORD' and link.from_socket.name == 'Generated':
            tree.links.new(attr.outputs['Vector'], link.to_socket)
    for node in tree.nodes:
        if node.type == 'TEX_NOISE' and not node.inputs['Vector'].is_linked:
            tree.links.new(attr.outputs['Vector'], node.inputs['Vector'])

def group_name(obj):
    if obj.name.startswith('Teto'):
        return 'Ceiling'
    if obj.name.startswith('Parede frontal'):
        return 'FrontWall'
    if any(slot.material and slot.material.name == 'Vidro transparente' for slot in obj.material_slots):
        return 'Glass'
    if any(slot.material and slot.material.name in {'Espelho', 'Cromado escovado'} for slot in obj.material_slots):
        return 'Reflective'
    if obj.name.startswith(('Parede', 'Piso', 'Contrapiso', 'Rodap', 'Moldura', 'Rejunte')):
        return 'Architecture'
    return 'Room'

groups = {}
for obj in meshes:
    groups.setdefault(group_name(obj), []).append(obj)
merged = {}
for name, objects in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    if len(objects) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    obj.name = name
    merged[name] = obj

bake_objects = [o for name, o in merged.items() if name not in {'Glass', 'Reflective'}]
atlases = {}
for obj in bake_objects:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for uv in list(obj.data.uv_layers):
        obj.data.uv_layers.remove(uv)
    obj.data.uv_layers.new(name='BakedUV')
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=1.1519, island_margin=0.0015, area_weight=0.5)
    bpy.ops.object.mode_set(mode='OBJECT')
    resolution = 4096 if obj.name == 'Room' else 2048 if obj.name == 'Architecture' else 1024
    atlas = bpy.data.images.new('Clinic lighting ' + obj.name, width=resolution, height=resolution, alpha=False)
    atlas.colorspace_settings.name = 'sRGB'
    atlases[obj.name] = atlas
print('BAKE: UV atlas ready', flush=True)

scene.render.bake.use_clear = True
scene.render.bake.margin = 2
scene.render.bake.use_pass_direct = True
scene.render.bake.use_pass_indirect = True
scene.render.bake.use_pass_color = True
for obj in bake_objects:
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for material in {slot.material for slot in obj.material_slots if slot.material}:
        node = material.node_tree.nodes.new('ShaderNodeTexImage')
        node.image = atlases[obj.name]
        material.node_tree.nodes.active = node
    print('BAKE: tracing', obj.name, flush=True)
    bpy.ops.object.bake(type='DIFFUSE')

# An unlit glTF material preserves the baked lighting without lighting it twice.
for obj in bake_objects:
    baked = bpy.data.materials.new('Clinic baked ' + obj.name)
    baked.use_nodes = True
    tree = baked.node_tree
    tree.nodes.clear()
    texture = tree.nodes.new('ShaderNodeTexImage')
    texture.image = atlases[obj.name]
    emission = tree.nodes.new('ShaderNodeEmission')
    output = tree.nodes.new('ShaderNodeOutputMaterial')
    tree.links.new(texture.outputs['Color'], emission.inputs['Color'])
    tree.links.new(emission.outputs[0], output.inputs['Surface'])
    obj.data.materials.clear()
    obj.data.materials.append(baked)
    for polygon in obj.data.polygons:
        polygon.material_index = 0

bpy.ops.object.select_all(action='DESELECT')
for obj in merged.values():
    obj.select_set(True)
camera.select_set(True)
output_path = ROOT / 'assets' / 'sala_atendimento_infantil_baked.glb'
bpy.ops.export_scene.gltf(
    filepath=str(output_path), export_format='GLB', use_selection=True,
    export_cameras=True, export_lights=False, export_animations=False,
    export_image_format='AUTO', export_texcoords=True, export_normals=True,
)
print('BAKE: exported', str(output_path), flush=True)

# A camera render of the exported finish provides a reproducible visual check.
scene.render.resolution_x = 600
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.cycles.samples = 8
scene.render.filepath = str(ROOT / 'assets' / 'clinic-bake-preview.png')
bpy.ops.render.render(write_still=True)
print('BAKE: complete', flush=True)
