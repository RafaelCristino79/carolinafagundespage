import {
  Box3, MathUtils, Mesh, PerspectiveCamera, PMREMGenerator,
  Scene, Spherical, Texture, Vector3, WebGLRenderer, AgXToneMapping,
} from "three";
import type { Object3D } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import modelUrl from "../../assets/sala_atendimento_infantil_web.glb?url";

export type ClinicView = "interior" | "overview";

export interface ClinicViewer {
  rotate: (direction: number) => void;
  zoom: (direction: number) => void;
  reset: () => void;
  setView: (view: ClinicView) => void;
  dispose: () => void;
}

function disposeModel(model: Object3D) {
  model.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => { if (value instanceof Texture) value.dispose(); });
      material.dispose();
    });
  });
}

export function createClinicViewer(
  canvas: HTMLCanvasElement,
  callbacks: { onLoad: () => void; onError: () => void },
): ClinicViewer {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = 2 ** -0.15;
  const scene = new Scene();
  const camera = new PerspectiveCamera(70, 1, 0.02, 200);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // Preserve page scrolling; zoom uses buttons or pinch.
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  // Lighting is baked into the room. Only the glass needs live reflections.
  const environmentScene = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene);
  scene.environment = environment.texture;
  environmentScene.dispose();
  pmrem.dispose();
  let disposed = false;
  let model: Object3D | undefined;
  let modelScenes: Object3D[] = [];
  let view: ClinicView = "interior";
  const eye = new Vector3(2.7, 1.78, 0.75);
  const direction = new Vector3(0, 0, -1);
  let interiorFov = 70;
  let initialDistance = 10;
  const initialDirection = new Vector3(0.35, 0.95, 1).normalize();

  const render = () => { if (!disposed) renderer.render(scene, camera); };
  const fit = () => {
    if (!model) return;
    const interior = view === "interior";
    model.traverse((object) => {
      if (object.name === "Ceiling" || object.name === "FrontWall") object.visible = interior;
    });
    controls.rotateSpeed = interior ? -0.5 : 1;
    if (interior) {
      camera.fov = interiorFov;
      controls.target.copy(eye);
      camera.position.copy(eye).addScaledVector(direction, -0.001);
      const orbit = new Spherical().setFromVector3(camera.position.clone().sub(eye));
      controls.minAzimuthAngle = orbit.theta - Math.PI * 0.42;
      controls.maxAzimuthAngle = orbit.theta + Math.PI * 0.42;
      controls.minPolarAngle = 0.3;
      controls.maxPolarAngle = Math.PI - 0.3;
      controls.minDistance = 0.001;
      controls.maxDistance = 0.001;
      camera.updateProjectionMatrix();
      controls.update();
      return;
    }
    camera.fov = 40;
    camera.updateProjectionMatrix();
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    const bounds = new Box3().setFromObject(model!);
    const size = bounds.getSize(new Vector3());
    const halfFov = MathUtils.degToRad(camera.fov / 2);
    initialDistance = Math.max(size.y, size.z, size.x / camera.aspect) / (2 * Math.tan(halfFov)) * 1.15;
    controls.target.copy(bounds.getCenter(new Vector3()));
    controls.minDistance = initialDistance * 0.35;
    controls.maxDistance = initialDistance * 1.7;
    camera.position.copy(controls.target).addScaledVector(initialDirection, initialDistance);
    controls.update();
    controls.saveState();
  };
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (model) fit();
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  controls.addEventListener("change", render);
  const rotate = (direction: number, vertical = false) => {
    if (view === "interior") direction *= -1;
    const orbit = new Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    if (vertical) orbit.phi = MathUtils.clamp(orbit.phi + direction * 0.15, controls.minPolarAngle, controls.maxPolarAngle);
    else orbit.theta += direction * 0.2;
    camera.position.copy(controls.target).add(new Vector3().setFromSpherical(orbit));
    controls.update();
  };
  const zoom = (direction: number) => {
    if (view === "interior") {
      camera.fov = MathUtils.clamp(camera.fov * Math.exp(-direction * 0.12), 35, 95);
      camera.updateProjectionMatrix();
      render();
      return;
    }
    const offset = camera.position.clone().sub(controls.target);
    offset.setLength(MathUtils.clamp(offset.length() * Math.exp(-direction * 0.15), controls.minDistance, controls.maxDistance));
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (!model) return;
    switch (event.key) {
      case "ArrowLeft": rotate(-1); break;
      case "ArrowRight": rotate(1); break;
      case "ArrowUp": rotate(-1, true); break;
      case "ArrowDown": rotate(1, true); break;
      case "+": case "=": zoom(1); break;
      case "-": zoom(-1); break;
      case "Home": fit(); render(); break;
      default: return;
    }
    event.preventDefault();
  };
  let pinchDistance = 0;
  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 2) { pinchDistance = 0; return; }
    const [a, b] = Array.from(event.touches);
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (pinchDistance) zoom(Math.log(distance / pinchDistance) / 0.15);
    pinchDistance = distance;
  };
  const endPinch = () => { pinchDistance = 0; };
  const onContextLost = (event: Event) => { event.preventDefault(); callbacks.onError(); };
  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("touchmove", onTouchMove, { passive: true });
  canvas.addEventListener("touchend", endPinch);
  canvas.addEventListener("webglcontextlost", onContextLost);
  resize();

  new GLTFLoader().load(modelUrl, (gltf) => {
    if (disposed) { gltf.scenes.forEach(disposeModel); return; }
    model = gltf.scene;
    modelScenes = gltf.scenes;
    const sourceCamera = gltf.cameras[0];
    if (sourceCamera) {
      model.updateMatrixWorld(true);
      sourceCamera.getWorldPosition(eye);
      sourceCamera.getWorldDirection(direction);
      if (sourceCamera instanceof PerspectiveCamera) interiorFov = sourceCamera.fov;
    }
    scene.add(model);
    fit();
    render();
    callbacks.onLoad();
  }, undefined, () => { if (!disposed) callbacks.onError(); });

  return {
    rotate,
    zoom,
    reset: () => { fit(); render(); },
    setView: (nextView) => { view = nextView; fit(); render(); },
    dispose: () => {
      disposed = true;
      observer.disconnect();
      controls.removeEventListener("change", render);
      controls.dispose();
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", endPinch);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      modelScenes.forEach(disposeModel);
      environment.dispose();
      renderer.dispose();
    },
  };
}
