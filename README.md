# EcoPuntos Urbano

Prototipo académico web de reciclaje para Cusco, Perú, creado con React, TypeScript y Vite. **Toda ubicación, métrica, recompensa, aliado, horario o registro mostrado es DEMO, ficticio o no verificado; no representa servicios reales.** No es una aplicación operativa ni está aprobada para Google Play.

## Requisitos

- Node.js 20.19+ o 22.12+ (versiones compatibles con Vite actual).
- npm.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que indique Vite (normalmente `http://localhost:5173`). No necesita claves, backend ni servicios externos. La tipografía puede cargarse desde Google Fonts si hay conexión; si no, se usa una fuente de sistema.

## Compilar

```bash
npm run build
npm run preview
```

La compilación de producción se genera en `dist/`.

## Funciones de demostración

- Navegación adaptable: navegación principal en escritorio y barra inferior en móvil.
- Lista y filtros de puntos ilustrativos; representación esquemática, no geográfica y sin mapa externo.
- Simulación de registro: suma 150 EcoPuntos DEMO sin cámara ni datos personales.
- Recompensas ficticias desactivadas para canje.
- Perfil e historial de muestra almacenados únicamente en `localStorage` del navegador. Se pueden borrar desde Perfil con confirmación.
- Privacidad, términos, soporte pendiente y contexto académico en la aplicación.

El prototipo no solicita permisos de cámara o ubicación y no envía información a servidores externos. Los datos pueden ser eliminados desde Perfil; borrar los datos del navegador también puede eliminarlos.

## Publicación

Publicar una aplicación en Google Play requiere revisar privacidad, seguridad, permisos, identidad gráfica y los requisitos vigentes de Google Play. Este proyecto **no está listo ni aprobado para Google Play**. También se deben verificar cualquier ubicación, servicio, alianza, recompensa y canal de soporte antes de ofrecer funciones reales.

## Crédito

Prototipo académico para el Programa de Sostenibilidad Urbana. Este crédito no representa aprobación ni respaldo oficial.
