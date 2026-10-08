# Nexo — tu tecnología, con intención

Nexo es una experiencia interactiva en español para acompañar a adolescentes a usar la tecnología con más intención, creatividad y pensamiento crítico.

## Qué contiene

- Reto diario con pasos guiados y registro de completado.
- Check-in de energía con recomendaciones personalizadas.
- Biblioteca de ideas: Pausa, Crea, Conecta y Piensa.
- Sistema de puntos, racha, minutos con intención e insignias.
- Intención personal editable y preguntas de reflexión.
- Guardado de ideas en una colección personal.
- Persistencia con `localStorage`.
- Diseño responsive para computadora y móvil.
- Empaquetado como aplicación de escritorio mediante Electron.

## Opción 1: usarlo como programa web

La versión web puede abrirse directamente con `index.html`. Para servirla localmente:

```bash
python3 -m http.server 4173
```

Después visita `http://localhost:4173`.

## Opción 2: ejecutarlo como aplicación de escritorio

Requiere Node.js y pnpm.

```bash
pnpm install
pnpm start
```

Esto abre Nexo en una ventana independiente de escritorio.

## Crear el archivo `.exe` para Windows

Desde esta carpeta, ejecuta:

```bash
pnpm install
pnpm run dist:windows
```

El resultado se generará en la carpeta `dist`, con un nombre similar a:

```text
Nexo-1.0.0-Windows-x64.exe
```

El resultado generado en este proyecto es:

```text
dist/Nexo-1.0.0-Windows-x64.exe
```

Es un ejecutable portátil de aproximadamente 72 MB. Está sin firma comercial de código; Windows podría mostrar una advertencia de SmartScreen en el primer arranque, por lo que debes elegir **Más información → Ejecutar de todas formas** solo si reconoces el archivo y su origen.

También puedes hacer doble clic en `build-windows.bat` desde Windows. Ese archivo instala las dependencias y construye el ejecutable automáticamente.

> El ejecutable portátil es de 64 bits y no necesita una instalación separada de Nexo. Para generarlo desde Linux o macOS puede requerirse una configuración adicional de compilación cruzada; la opción más directa es ejecutar `build-windows.bat` en un equipo Windows.

## Estructura principal

- `index.html` — estructura y contenido.
- `styles.css` — diseño visual responsive.
- `script.js` — interacción y persistencia.
- `electron-main.cjs` — ventana principal de escritorio.
- `electron-preload.cjs` — puente seguro para futuras funciones nativas.
- `package.json` — scripts de desarrollo y empaquetado.
- `build-windows.bat` — automatización de la creación del `.exe` en Windows.
