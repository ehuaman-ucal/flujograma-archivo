# Verificaciones ejecutadas

Refactorización sobre `fix`, tomando como referencia el commit original `f3964eb94ce1336a925672886e9fe6c8d0be5aff`.

- `npm test`: 7 pruebas superadas. Datos completos, siete flujos, HTML generado, variantes de pasos, 16.384 combinaciones de filtros, orden CSS y estructura HTML estática conservados.
- Chromium instalado en `/usr/bin/chromium`: se completaron las comprobaciones de navegador para 1440, 768 y 390 px, en ejecuciones separadas durante la validación. Se usó una copia de los tres archivos originales como `ORIGINAL_DIR`.
- Escritorio: apertura de todas las tarjetas de pasos, incluidas decisiones y variantes con responsables alternativos. En tableta y móvil: apertura de detalle representativo. En los tres tamaños: filtros combinados, limpieza, filtro desde equipo, expansión/contracción, diálogo de sistemas, preparación y restauración de impresión.
- Navegación horizontal comprobada en escritorio y tableta; en móvil se verificó la secuencia vertical y la ocultación de los controles horizontales originales.
- Comparaciones visuales de inicio, detalle, filtros e impresión. Tolerancia máxima 1/255 por canal; para el detalle se compara el panel y su geometría, excluyendo el fondo desenfocado. El test espera a que se componga el diálogo antes de capturarlo.
- Se generó un PDF en la ejecución de escritorio.
- No se detectaron excepciones JavaScript ni recursos locales rotos en la ejecución completa de móvil. La aplicación se sirvió por HTTP bajo `/flujograma-archivo/`, sin compilación.
- `git diff --cached --check`: sin errores.

## Alcance y limitaciones

El navegador de este entorno no cargó las hojas externas de Google Fonts ni Font Awesome. Las comparaciones se realizaron con los mismos recursos de respaldo en ambas versiones. Sus URLs originales permanecen intactas; la comprobación de la cascada verifica además la conservación del contenido y orden de todas las reglas locales. No se comprobó el acceso a documentos privados enlazados en Google; sus URLs se conservaron y forman parte de las pruebas de integridad del HTML y los datos.

Las capturas y el PDF están en `test-results/`, excluidos de Git. Las pruebas se pueden repetir siguiendo el README. No se cambió la configuración de GitHub Pages ni se fusionó la rama con `main`.
