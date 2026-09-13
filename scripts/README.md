# Preparar o consultório para a web

O site usa `assets/sala_atendimento_infantil_web.glb`, derivado do `.blend`
original. O arquivo original e o render de referência são preservados.

Para refazer o acabamento após alterar materiais ou iluminação, execute a
partir da raiz do projeto (ajuste o caminho do Blender se necessário):

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --disable-autoexec 'assets/sala_atendimento_infantil.blend' --python scripts/prepare-clinic-model.py
```

O script mantém as coordenadas das texturas procedurais, agrupa a geometria,
cria um atlas UV de 4096 px e calcula a iluminação no Cycles. O teto fica em
um objeto separado para permitir alternar entre a vista interna e a maquete.
A câmera original também é exportada. A preparação pode levar vários minutos.

O resultado usa um material sem iluminação adicional para evitar iluminar as
sombras gravadas uma segunda vez. O vidro continua com material físico.
Reflexos e efeitos que dependem da posição da câmera não são idênticos ao
render final do Cycles. A prévia `assets/clinic-bake-preview.png` permite
comparar o material preparado com o render original.

Após gerar, rode `npm run build` e `npm run lint` e confira as duas vistas no
navegador, incluindo zoom, teclado e tela pequena.
