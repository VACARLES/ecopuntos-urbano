# EcoPuntos Urbano

Prototipo académico web de reciclaje para Cusco, Perú, creado con React, TypeScript y Vite. Los puntos, horarios, métricas, aliados, recompensas, saldos e historiales son **DEMO, ficticios o no verificados**; no representan servicios reales ni implican respaldo institucional.

## Requisitos e instalación

Se recomienda Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abre la dirección local indicada por Vite (habitualmente `http://localhost:5173`). La aplicación no requiere claves ni backend. La interfaz usa tipografías del sistema y recursos propios; no carga fuentes, mapas ni servicios externos.

## Compilar y previsualizar

```bash
npm run build
npm run preview
```

La compilación se genera en `dist/`.

## Funciones DEMO y privacidad

- Interfaz móvil centrada, navegación inferior fija y páginas informativas con más espacio en pantallas grandes.
- Ecopuntos esquemáticos e ilustrativos con filtros de plástico, vidrio, papel y electrónicos; no utiliza ubicación del usuario ni mapas externos.
- Escaneo simulado, sin cámara ni permisos: el botón suma 150 EcoPuntos ficticios y no registra una entrega real.
- Recompensas con costos de ejemplo y canje desactivado; no son válidas en comercios reales.
- Perfil e historial guardados únicamente en `localStorage` del navegador. Se pueden borrar desde Perfil con confirmación.
- No se solicita información personal ni se envían datos a servidores externos. El contacto oficial de soporte está pendiente.

## Antes de una publicación real

Este prototipo no está listo ni aprobado para Google Play. Antes de cualquier publicación:

- Revisar privacidad y seguridad.
- Definir y documentar el tratamiento de datos.
- Probar la aplicación en dispositivos y tamaños de pantalla reales.
- Preparar y revisar los iconos e identidad gráfica.
- Verificar los requisitos vigentes de la tienda y completar sus revisiones aplicables.
- Verificar cualquier ubicación, servicio, alianza, recompensa y canal de soporte antes de presentarlos como reales.

Un manifest o una configuración web progresiva, si se agregaran en el futuro, no publicarían por sí solos la aplicación en Google Play.

## Crédito

Prototipo académico para el Programa de Sostenibilidad Urbana. Este crédito no representa aprobación ni respaldo institucional.
