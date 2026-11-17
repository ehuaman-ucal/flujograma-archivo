# Flujograma Archivo UPCH

Mapa interactivo de los siete flujos operativos del Área de Archivo de la Universidad Peruana Cayetano Heredia: actividades, responsables, sistemas, tiempos, decisiones y proyectos. Aplicación estática con HTML5, CSS3 y JavaScript Vanilla mediante módulos ES nativos. No requiere compilación ni dependencias de producción. Conserva las fuentes de Google Fonts y los iconos de Font Awesome del proyecto original.

## Ejecutar localmente

Desde la raíz del repositorio:

```sh
python3 -m http.server 8001
```

Abrir `http://localhost:8001/`. Los módulos requieren HTTP; no abrir `index.html` mediante `file://`.

## Organización

```text
index.html                 Estructura semántica, accesibilidad y plantilla de sistemas
.nojekyll                  Publicación sin Jekyll
css/
  base.css                 Variables, reset, tipografía y estilos globales
  components.css           Componentes y animaciones originales
  responsive.css           Pantallas y movimiento reducido originales
  print.css                Impresión/PDF
  components-overrides.css Ajustes posteriores de componentes y proyectos
  responsive-overrides.css Ajustes posteriores para móviles
  components-inventory.css Reglas finales de inventarios
js/
  app.js                   Inicialización y registro de servicios
  data/
    people.js              Catálogo PEOPLE
    systems.js             Catálogo SYSTEMS
    flows.js               PROCESS_OPTIONS, FLOWS y definición FAENF compartida
    catalog.js             Índice de pasos y recuentos derivados de los catálogos
  components/
    visuals.js             Avatares, responsables e iconos reutilizables
    step-card.js           Tarjetas de pasos y secuencias horizontales
    branches.js            Ramificaciones, decisiones y cobertura documental
    digitacion.js          Unidades académicas y secciones de digitación
    project-card.js        Proyectos, progreso, líneas paralelas y adicionales
    flow-card.js           Composición del contenido y tarjetas de flujo
    flow-index.js          Índice de procesos
    team-card.js           Equipo y sus flujos
    page-chrome.js         Indicadores y sistemas del pie de página
    dialog.js              Detalles, sistemas, cierre y restauración del foco
  services/
    filters.js             Estado, menús, combinaciones, chips y resultados
    navigation.js          Anclas, índice activo, equipo, desplazamiento y expansión
    print.js               Impresión y restauración del estado de los flujos
  utils/
    helpers.js             Escape de HTML, numeración y clase de estado
    dom.js                 Consultas DOM compartidas
 tests/
  baseline.json            Huellas de la versión original
  regression.test.js       Integridad, HTML, CSS y combinaciones de filtros
  browser.mjs              Pruebas de interacción y comparación visual opcional
```

Los componentes importan los datos y las funciones de presentación que necesitan. Los servicios controlan las interacciones; `app.js` compone la vista inicial y registra los eventos una vez. El índice y los recuentos se calculan a partir de los datos, sin duplicarlos. La definición `FAENF_SILABOS_LANE` sigue compartida entre los flujos que la utilizan.

La división CSS conserva el orden original de todas las reglas. Se mantienen tres archivos adicionales porque el archivo anterior incluía ajustes de componentes después de impresión, otra media query móvil y reglas finales de inventario. Agruparlos al principio cambiaría su precedencia. Los siete enlaces de `index.html` deben mantenerse en el orden actual; `print.css` conserva su `@media print` interno.

## Editar datos

Para modificar un flujo, editar su objeto `FLOWS.push(...)` en `js/data/flows.js`. Mantener su número `n`, los identificadores únicos de los pasos y sus referencias en `mainSteps`, `bodySections`, ramas y proyectos. Las propiedades `owner`, `support`, `people` y `systems` usan identificadores de los catálogos. `linkFlow`, los botones y los pies de flujo conectan con otro número de flujo. Las entradas, salidas, avisos y rutas se conservan dentro de cada paso. Cambiar la información FAENF común en una sola definición.

Para agregar un flujo, añadir su objeto con un número único y un `kind` ya soportado, pasos y metadatos. Registrar o reutilizar su grupo en `PROCESS_OPTIONS`. Los recuentos, el índice y el equipo se derivan automáticamente de `FLOWS`. Un tipo de presentación distinto requiere un renderizador explícito en `components/flow-card.js`.

Para agregar responsables, crear una entrada en `people.js` con `name`, `role`, `initials`, `color`, `bg` y `desc`; usar `lead` si corresponde a supervisión. Referenciar su identificador en los flujos y pasos pertinentes. Para agregar sistemas, crear una entrada en `systems.js` con `name`, `desc`, `icon`, `color` y `bg`, y usar su identificador en los datos. Los menús y los indicadores se generan desde los catálogos.

## GitHub Pages

Todos los recursos locales usan rutas relativas y funcionan bajo `/flujograma-archivo/`. Publicar los archivos desde la raíz de la rama elegida en **Settings → Pages → Deploy from a branch**. Conservar `.nojekyll`. Esta refactorización se desarrolla en `fix`; cambiar la rama publicada o fusionar con `main` es una operación independiente.

## Pruebas

Con Node.js 22 o superior, las pruebas de integridad no necesitan instalar paquetes:

```sh
npm test
```

Las huellas de `tests/baseline.json` se obtuvieron del código original del commit `f3964eb94ce1336a925672886e9fe6c8d0be5aff`. Comprueban datos completos, HTML de flujos y variantes de pasos, las 16.384 combinaciones de proceso y selecciones múltiples de personas y sistemas (incluida la ausencia de selección), orden CSS y HTML estático. Una edición intencional de contenido requerirá revisar estas expectativas; no regenerarlas para ocultar regresiones.

Para las pruebas de navegador, instalar únicamente las dependencias de desarrollo:

```sh
npm ci
npx playwright install chromium
npm run test:browser
```

Se puede usar un Chromium existente mediante `CHROMIUM_PATH=/ruta/a/chromium npm run test:browser`. El script levanta su propio servidor bajo `/flujograma-archivo/` y comprueba escritorio (1440 px), tableta (768 px) y móvil (390 px), detalles, filtros, selección del equipo, navegación horizontal (o secuencia vertical en móvil), expansión, impresión y restauración. Genera capturas y un PDF en `test-results/`, excluido de Git.

Para comparar con una copia de la versión anterior:

```sh
ORIGINAL_DIR=/ruta/al/original npm run test:browser
```

Esa copia debe contener `index.html`, `app.js` y `styles.css` originales. La comparación exige capturas PNG con una tolerancia máxima de 1/255 por canal para el redondeo del desenfoque de Chromium con el mismo navegador, tamaño, fuentes y movimiento reducido; compara inicio, filtros e impresión completos; en detalle compara el panel y su geometría, excluyendo el fondo desenfocado que Chromium compone de forma variable entre pestañas. Los errores JavaScript y los recursos locales rotos hacen fallar la prueba. Los fallos de recursos externos se informan por separado.
