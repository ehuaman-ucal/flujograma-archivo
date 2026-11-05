
'use strict';

/* ============================================================
   DATOS · Personas y sistemas
   ============================================================ */
const PEOPLE = {
  martin: {
    name: 'Martín Carbajo', role: 'Supervisor de Archivo',
    initials: 'MA', color: '#E71230', bg: '#FDECEE', lead: true,
    desc: 'Coordina solicitudes, derivaciones y supervisión operativa.'
  },
  adriana: {
    name: 'Adriana Leonardo', role: 'Auxiliar de Archivo',
    initials: 'AD', color: '#C58A00', bg: '#FFF6D9',
    desc: 'Búsqueda, digitalización, indexación e inventario.'
  },
  sebastian: {
    name: 'Sebastián Huaman', role: 'Auxiliar de Archivo',
    initials: 'SE', color: '#0F766E', bg: '#E6F5F3',
    desc: 'Control de calidad, auditoría y despliegue del buscador SG.'
  },
  yesely: {
    name: 'Yesely Rafael', role: 'Auxiliar de Archivo - FAENF',
    initials: 'YE', color: '#6D3BD1', bg: '#F0EBFF',
    desc: 'Digitación y escaneo del archivo histórico FAENF.'
  },
  lucero: {
    name: 'Lucero Garcia', role: 'Auxiliar de Archivo - Clínica “CREO”',
    initials: 'LU', color: '#1D4ED8', bg: '#E9EFFF',
    desc: 'Custodia, préstamos y archivo de historias clínicas.'
  },
  grace: {
    name: 'Grace Guillen', role: 'Digitadora',
    initials: 'GR', color: '#BE185D', bg: '#FDECF4',
    desc: 'Digitación FAMED y búsqueda masiva de resoluciones.'
  },
  yomira: {
    name: 'Yomira Diaz', role: 'Digitadora',
    initials: 'YO', color: '#C2410C', bg: '#FFF0E8',
    desc: 'Digitación FAMED y búsqueda masiva de resoluciones.'
  },
  klaudia: {
    name: 'Klaudia Talledo', role: 'Digitadora',
    initials: 'KL', color: '#15803D', bg: '#E9F8EF',
    desc: 'Digitación FAMED e indexación de resoluciones SEGEN.'
  }
};

const SYSTEMS = {
  fileserver: {
    name: 'FileServer', desc: 'Repositorio documental',
    icon: 'fa-server', color: '#E71230', bg: '#FDECEE'
  },
  imaging: {
    name: 'ImagingSoft', desc: 'Digitalización e indexación',
    icon: 'fa-camera-retro', color: '#0F766E', bg: '#E6F5F3'
  },
  sheets: {
    name: 'Sheets/Drive', desc: 'Control, reportes y respaldo',
    icon: 'fa-table-cells-large', color: '#9A6500', bg: '#FFF6D9'
  }
};

const PROCESS_OPTIONS = [
  { value: 'all', label: 'Todos los procesos', hint: 'Mapa completo · 7 flujos' },
  { value: 'solicitudes', label: 'Atención de Solicitudes', hint: 'Flujo 1 · Martín y Adriana', color: '#E71230' },
  { value: 'escaneo', label: 'Escaneo e indexación', hint: 'Flujo 2 · Adriana y Yesely', color: '#0F766E' },
  { value: 'segen', label: 'SEGEN · Resoluciones', hint: 'Flujo 3 · Martín y Klaudia', color: '#C58A00' },
  { value: 'digitacion', label: 'Digitación Sílabos', hint: 'Flujo 4 · FAMED y FAENF', color: '#6D3BD1' },
  { value: 'calidad', label: 'Control de Calidad', hint: 'Flujo 5 · Sebastián', color: '#1D4ED8' },
  { value: 'historias', label: 'Historias Clínicas (CREO)', hint: 'Flujo 6 · Lucero', color: '#BE185D' },
  { value: 'proyectos', label: 'Proyectos Temporales', hint: 'Flujo 7 · Resoluciones y buscador SG', color: '#171914' }
];

const FLOWS = [];

/* ============================================================
   FLUJO 1 · Atención de solicitudes
   ============================================================ */
FLOWS.push({
  n: 1,
  shortName: 'Atención de solicitudes',
  fullName: 'Atención de Solicitudes de Documentos',
  groupLabel: 'Solicitudes',
  groups: ['solicitudes'],
  tone: '#E71230', toneBg: '#FDECEE',
  tagline: 'Recepción en Gmail, búsqueda en FileServer y derivación al Archivo de Secretaría General cuando el documento no está disponible.',
  people: ['martin', 'adriana'],
  systems: ['fileserver', 'sheets'],
  duration: '~5 h en ruta crítica',
  frequency: 'A demanda',
  status: 'Operativo', statusTone: 'live',
  mainSteps: ['f1s1', 'f1s2', 'f1s3'],
  steps: [
    {
      id: 'f1s1', n: 1, title: 'Recepción de la solicitud', owner: 'martin',
      support: ['adriana'],
      systems: [], channel: 'Gmail', time: '15 min', icon: 'fa-envelope-open-text',
      summary: 'Ingreso de la solicitud por Gmail y validación de los datos del pedido.',
      detail: 'El supervisor recepciona la solicitud enviada por Gmail, identifica el documento requerido y verifica que el pedido incluya los datos mínimos para iniciar la búsqueda.',
      inputs: ['Correo con la solicitud', 'Datos del documento requerido'],
      outputs: ['Solicitud registrada y asignada']
    },
    {
      id: 'f1s2', n: 2, title: 'Búsqueda en FileServer', owner: 'adriana',
      support: ['martin'],
      systems: ['fileserver'], time: '~1 hora', icon: 'fa-magnifying-glass',
      summary: 'Búsqueda del documento por área, año, tipo y número en el repositorio.',
      detail: 'Se realiza la búsqueda del documento en el repositorio FileServer utilizando criterios de área, año, tipo y número de documento. Si la solicitud es ambigua, se coordina con el usuario.',
      inputs: ['Criterios de búsqueda', 'Datos del solicitante'],
      outputs: ['Ubicación del documento o confirmación de ausencia']
    },
    {
      id: 'f1s3', n: 3, title: '¿Documento localizado?', owner: 'adriana',
      support: ['martin'],
      systems: ['fileserver'], time: '—', icon: 'fa-code-branch', decision: true,
      summary: 'Punto de decisión: responder con el documento o derivar a Secretaría General.',
      detail: 'Punto de decisión: si el documento existe en FileServer se responde directamente; si no, se deriva la búsqueda al Archivo de Secretaría General.',
      inputs: ['Resultado de la búsqueda en FileServer'],
      outputs: ['Ruta A: envío directo', 'Ruta B: derivación a Secretaría General']
    },
    {
      id: 'f1s4', n: 4, title: 'Envío + resguardo del documento', owner: 'adriana',
      support: ['martin'],
      systems: ['fileserver', 'sheets'], time: '15–30 min', icon: 'fa-paper-plane',
      summary: 'Entrega al solicitante y registro de la entrega para trazabilidad.',
      detail: 'Se envía el documento al solicitante y se registra la entrega en la hoja de control para mantener trazabilidad y evitar envíos duplicados.',
      inputs: ['Documento localizado', 'Correo del solicitante'],
      outputs: ['Documento enviado', 'Registro de entrega en Sheets/Drive']
    },
    {
      id: 'f1s5', n: 5, title: 'Solicitud al Archivo de Secretaría General', owner: 'martin',
      support: ['adriana'],
      systems: [], channel: 'Correo institucional', time: '≈ 4 h de respuesta', icon: 'fa-building-columns',
      summary: 'Derivación formal a Secretaría General con los datos del documento.',
      detail: 'Se deriva la solicitud al Archivo de Secretaría General por el canal institucional, adjuntando los datos del documento y del solicitante. El tiempo estimado de respuesta es de aproximadamente 4 horas.',
      inputs: ['Solicitud sin coincidencia local', 'Datos del documento y del solicitante'],
      outputs: ['Respuesta de Secretaría General']
    },
    {
      id: 'f1s6', n: 6, title: '¿Existe en Archivo de Secretaría General?', owner: 'martin',
      support: ['adriana'],
      systems: [], time: '—', icon: 'fa-code-branch', decision: true,
      summary: 'Evaluación de la respuesta de Secretaría General y siguiente ruta.',
      detail: 'Se evalúa la respuesta de Secretaría General. Si confirma la existencia del documento, se continúa con el envío y resguardo; si no existe, se notifica al usuario para que inicie el trámite formal.',
      inputs: ['Respuesta de Secretaría General'],
      outputs: ['Continuar en Paso 04', 'Notificación al usuario']
    },
    {
      id: 'f1s7', n: 7, title: 'Notificar al usuario para trámite formal', owner: 'martin',
      support: ['adriana'],
      systems: [], channel: 'Gmail', time: '15 min', icon: 'fa-bell',
      summary: 'Comunicación de ausencia y orientación al trámite correspondiente.',
      detail: 'Se comunica al usuario que el documento no fue localizado y se le orienta a iniciar el trámite formal correspondiente ante la instancia competente.',
      inputs: ['Confirmación de ausencia del documento'],
      outputs: ['Notificación enviada al usuario', 'Trámite formal iniciado']
    }
  ],
  branches: [
    {
      label: 'Sí', tone: 'success', short: 'Ruta directa',
      condition: 'Documento localizado en FileServer',
      stepIds: ['f1s4'],
      outcome: 'Fin del flujo · documento entregado y registrado'
    },
    {
      label: 'No', tone: 'danger', short: 'Ruta de derivación',
      condition: 'Documento no localizado en FileServer',
      stepIds: ['f1s5', 'f1s6'],
      subbranches: [
        {
          label: 'Sí', tone: 'success',
          condition: 'Secretaría General confirma existencia',
          linkStep: 'f1s4',
          linkLabel: 'Continuar en Paso 04 · Envío + resguardo'
        },
        {
          label: 'No', tone: 'danger',
          condition: 'No existe en Secretaría General',
          stepIds: ['f1s7']
        }
      ]
    }
  ],
  footer: {
    text: 'Ruta crítica estimada: ~1 hora de búsqueda local + un máximo referencial de 4 horas de respuesta de Secretaría General.'
  }
});

/* ============================================================
   TARJETA COMPARTIDA · FAENF · Sílabos
   Se define una sola vez y se pinta en Flujo 4 (origen) y en
   Flujo 2 · Digitalización (copia de seguimiento).
   ============================================================ */
const FAENF_SILABOS_LANE = {
  title: 'FAENF', subtitle: 'Facultad de Enfermería',
  icon: 'fa-user-nurse', color: '#6D3BD1', bg: '#F0EBFF',
  team: ['yesely'],
  systems: ['imaging', 'sheets'],
  status: 'Pendiente',
  statusTone: 'soon',
  current: [],
  headRows: [
    { label: 'Archivo: 1941 - 2020 (Proyección pendiente 1998-2020)', state: 'soon' }
  ],
  pending: [
    { label: 'Indexación y preservación', system: 'imaging', state: 'soon' }
  ],
  note: 'La indexación pendiente se realizará directamente en ImagingSoft.'
};

/* ============================================================
   FLUJO 2 · Traslado, digitalización e inventario
   ============================================================ */
FLOWS.push({
  n: 2,
  shortName: 'Escaneo e indexación',
  fullName: 'Traslado, acondicionamiento, digitalización, control e inventario',
  groupLabel: 'Digitalización',
  groups: ['escaneo'],
  tone: '#0F766E', toneBg: '#E6F5F3',
  tagline: 'Ciclo técnico del material documental: solicitud de cajas a Iron Mountain, traslado al Archivo FAMED, preparación, escaneo, indexación e inventario físico.',
  people: ['martin', 'adriana', 'yesely'],
  systems: ['imaging', 'sheets'],
  duration: 'Ciclo continuo · 8 etapas',
  frequency: 'FAMED-Diario',
  frequencyAlt: 'FAENF-A demanda',
  status: 'En operación', statusTone: 'live',
  inventory: {
    owner: 'adriana',
    links: [
      { label: 'Posgrado Enfermería', url: 'https://docs.google.com/spreadsheets/d/1_83o29wFrFORXX7abPdxYS6Dgih4h7VI/edit?gid=1052546054#gid=1052546054' },
      { label: 'Pregrado Sanidad Naval', url: 'https://docs.google.com/spreadsheets/d/1W4pez3ljaNghZYICTizM-4KeFCFzjWuz/edit?gid=804412311#gid=804412311' },
      { label: 'Consolidado 2024', url: 'https://docs.google.com/spreadsheets/d/1ANYpJbhfx9ThA6Pz9ij7diMWKyW0RFq-zXhFQCCgKHQ/edit?gid=777300826#gid=777300826' }
    ]
  },
  mainSteps: ['f2s0', 'f2s1', 'f2s2', 'f2s3', 'f2s4', 'f2s5', 'f2s6', 'f2s7'],
  bodySections: [
    { title: 'FAMED' },
    { title: 'FAENF', period: '2021-2026', steps: ['f2s2', 'f2s3', 'f2s4', 'f2s8'], owner: 'yesely', renumber: true },
    { card: FAENF_SILABOS_LANE }
  ],
  steps: [
    {
      id: 'f2s0', n: 1, title: 'Solicitud de material (cajas) a Iron Mountain', owner: 'martin',
      support: ['adriana'],
      systems: [], channel: 'Gmail', time: '3–4 días de respuesta', icon: 'fa-boxes-packing',
      summary: 'Pedido vía correo al almacén que resguarda el material archivístico.',
      detail: 'Se solicita el material archivístico (cajas) a Iron Mountain mediante correo electrónico al almacén que lo resguarda, indicando la relación de cajas requeridas y el sustento del pedido. La atención regular toma entre 3 y 4 días.',
      inputs: ['Requerimiento de material', 'Relación de cajas solicitadas'],
      outputs: ['Cajas solicitadas al almacén', 'Constancia del pedido por correo'],
      notice: {
        tone: 'rush',
        icon: 'fa-bolt',
        title: 'Tipo de solicitud · Rush',
        text: 'Además de la solicitud regular, existe el tipo de solicitud "Rush", que se atiende en 3–4 horas de respuesta.'
      }
    },
    {
      id: 'f2s1', n: 2, title: 'Traslado del material a procesar', owner: 'adriana',
      support: ['sebastian'],
      systems: [], channel: 'Traslado físico', time: '30 min', icon: 'fa-truck-fast',
      summary: 'Traslado de Archivo Central a Archivo FAMED con verificación de cajas.',
      detail: 'Se recibe y traslada el material documental desde el Archivo Central hacia el Archivo FAMED, verificando la relación de cajas y las condiciones de traslado.',
      inputs: ['Relación de material y cajas', 'Programación de traslado'],
      outputs: ['Material recepcionado en el Archivo FAMED']
    },
    {
      id: 'f2s2', n: 3, title: 'Preparación, depuración y reacondicionamiento', owner: 'adriana',
      systems: [], time: 'Variable', icon: 'fa-box-open',
      summary: 'Limpieza, orden y reacondicionamiento del material antes del escaneo.',
      detail: 'Se revisa el material, se retiran elementos metálicos o deteriorados, se ordenan las piezas y se reacondiciona la documentación para su digitalización.',
      inputs: ['Material recepcionado'],
      outputs: ['Material apto para escaneo']
    },
    {
      id: 'f2s3', n: 4, title: 'Validación e integración de contenido', owner: 'adriana',
      systems: ['sheets'], time: 'Variable', icon: 'fa-list-check',
      summary: 'Verificación de secuencia, completitud e integración del contenido.',
      detail: 'Se valida la secuencia, completitud e integración del contenido antes de escanear, registrando observaciones en la hoja de control.',
      inputs: ['Material preparado', 'Checklist de contenido'],
      outputs: ['Lote validado', 'Observaciones registradas en Sheets/Drive']
    },
    {
      id: 'f2s4', n: 5, title: 'Escaneo con driver mejorado', owner: 'adriana',
      systems: ['imaging'], time: 'Variable', icon: 'fa-camera-retro',
      summary: 'Digitalización con resolución y configuración optimizadas.',
      detail: 'Se digitaliza el material con el driver optimizado, ajustando resolución y configuración para mejorar la calidad y velocidad del escaneo.',
      inputs: ['Lote validado', 'Equipo de escaneo configurado'],
      outputs: ['Imágenes digitales del lote']
    },
    {
      id: 'f2s5', n: 6, title: 'Indexación y preservación', owner: 'adriana',
      systems: ['imaging'], time: 'Variable', icon: 'fa-tags',
      summary: 'Metadatos, naming y criterios de preservación en ImagingSoft.',
      detail: 'Se indexan los metadatos del documento en ImagingSoft y se aplican criterios de preservación y naming para asegurar su recuperación a largo plazo.',
      inputs: ['Imágenes digitales'],
      outputs: ['Documento indexado y disponible en ImagingSoft']
    },
    {
      id: 'f2s6', n: 7, title: 'Corroboración del inventario y archivamiento', owner: 'adriana',
      systems: ['sheets'], time: '½ día', icon: 'fa-boxes-stacked',
      summary: 'Validacion , rutulado, registro y preparación',
      detail: 'Validación del inventario, rotulado de cajas, registro en Excel y preparacion previa al traslado.',
      inputs: ['Material digitalizado', 'Relación de cajas'],
      outputs: ['Inventario actualizado', 'Cajas rotuladas y reubicadas']
    },
    {
      id: 'f2s7', n: 8, title: 'Gestión de traslado y recojo de material físico', owner: 'adriana',
      support: ['sebastian'],
      systems: [], channel: 'Traslado físico', time: 'Según programación', icon: 'fa-right-left',
      summary: 'Coordinación Almacén Archivo Central ↔ Archivo FAMED.',
      detail: 'Se coordina el traslado y recojo de material físico entre el Almacén del Archivo Central y el Archivo FAMED, dejando constancia del movimiento y de las cajas entregadas o devueltas.',
      inputs: ['Inventario actualizado', 'Requerimiento de recojo'],
      outputs: ['Material trasladado', 'Constancia de recojo']
    },
    {
      id: 'f2s8', n: 9, title: 'Guardado de resoluciones digitalizadas', owner: 'yesely',
      systems: [], channel: 'Disco local + PenDrive', time: 'Variable', icon: 'fa-hard-drive',
      summary: 'Respaldo en disco local y PenDrive antes de liberar el material.',
      detail: 'Las resoluciones digitalizadas se guardan en memoria en el disco local y en un PenDrive, manteniendo una copia de respaldo antes de liberar el material físico.',
      inputs: ['Resoluciones digitalizadas'],
      outputs: ['Copia en disco local', 'Respaldo en PenDrive']
    }
  ],
  footer: {
    text: 'La destrucción y eliminación del material se coordina con el Flujo 5; el recojo físico cierra el ciclo con el Archivo Central.',
    flow: 5, linkLabel: 'Ver Flujo 5 · Control de calidad'
  }
});

/* ============================================================
   FLUJO 3 · Indexación de resoluciones SEGEN
   ============================================================ */
FLOWS.push({
  n: 3,
  shortName: 'Resoluciones SEGEN',
  fullName: 'Indexación de Resoluciones SEGEN',
  groupLabel: 'SEGEN · Resoluciones',
  groups: ['segen'],
  tone: '#C58A00', toneBg: '#FFF6D9',
  tagline: 'Ingesta quincenal al repositorio ImagingSoft y clasificación de resoluciones en cinco tipos documentales para su recuperación.',
  people: ['martin', 'klaudia'],
  systems: ['imaging'],
  duration: 'Lote quincenal',
  frequency: 'Quincenal',
  status: 'Quincenal', statusTone: 'gold',
  steps: [
    {
      id: 'f3s1', n: 1, title: 'Ingesta al repositorio ImagingSoft', owner: 'martin',
      systems: ['imaging'], time: 'Quincenal', icon: 'fa-file-import',
      summary: 'Carga del lote de resoluciones y verificación del período.',
      detail: 'Se cargan los lotes de resoluciones al repositorio ImagingSoft, verificando que el paquete corresponda al período quincenal y que los archivos estén completos.',
      inputs: ['Lote de resoluciones digitalizadas', 'Relación del período'],
      outputs: ['Lote disponible en ImagingSoft']
    },
    {
      id: 'f3s2', n: 2, title: 'Clasificación por tipo de resolución', owner: 'klaudia',
      systems: ['imaging'], time: 'Quincenal', icon: 'fa-layer-group',
      summary: 'Asignación de una de las cinco categorías documentales definidas.',
      detail: 'Cada resolución se clasifica en una de las cinco categorías definidas: Alumnos, Docentes, Plan Curricular, Plan de Estudios y UPCH. Esta clasificación ordena la indexación y facilita la búsqueda posterior.',
      inputs: ['Resolución digitalizada'],
      outputs: ['Resolución clasificada por tipo']
    },
    {
      id: 'f3s3', n: 3, title: 'Indexación de metadatos en ImagingSoft', owner: 'klaudia',
      systems: ['imaging'], time: 'Quincenal', icon: 'fa-tags',
      summary: 'Completado de metadata, validación del lote y cierre quincenal.',
      detail: 'Se completa la metadata requerida para cada resolución: tipo, número, fecha, área y demás campos de búsqueda. Se valida el lote antes de cerrar la quincena y dejar las resoluciones localizables.',
      inputs: ['Resoluciones clasificadas'],
      outputs: ['Resoluciones localizables en ImagingSoft', 'Lote quincenal cerrado']
    }
  ],
  coverage: [
    { label: 'Alumnos', icon: 'fa-user-graduate' },
    { label: 'Docentes', icon: 'fa-chalkboard-user' },
    { label: 'Plan Curricular', icon: 'fa-book-open' },
    { label: 'Plan de Estudios', icon: 'fa-list-check' },
    { label: 'UPCH', icon: 'fa-building-columns' },
    { label: 'Convenios', icon: 'fa-file-signature' }
  ],
  footer: {
    text: 'Cobertura documental: seis tipos de resoluciones. Frecuencia de trabajo: quincenal.'
  }
});
/* ============================================================
   FLUJO 4 · Digitación de sílabos
   ============================================================ */
FLOWS.push({
  n: 4,
  shortName: 'Digitación de sílabos',
  fullName: 'Digitación de Sílabos · FAMED & FAENF',
  groupLabel: 'Sílabos',
  groups: ['digitacion'],
  tone: '#6D3BD1', toneBg: '#F0EBFF',
  tagline: 'Digitación de sílabos de Medicina y Enfermería con una meta diaria compartida, orden descendente por años y control de calidad posterior.',
  people: ['grace', 'yomira', 'klaudia', 'yesely'],
  systems: ['sheets', 'imaging'],
  duration: 'Meta diaria 25–30 hojas',
  frequency: 'Producción continua',
  status: 'En proceso', statusTone: 'gold',
  kind: 'digitacion',
  lanes: [
    {
      title: 'FAMED', subtitle: 'Facultad de Medicina',
      icon: 'fa-stethoscope', color: '#E71230', bg: '#FDECEE',
      team: ['grace', 'yomira', 'klaudia'],
      systems: ['sheets'],
      current: [
        { label: 'Pregrado', range: '1980 → 1974', state: 'now' }
      ],
      pending: [
        { label: 'Posgrado', range: '→ 2020', state: 'soon' },
        { label: 'Especialidad', range: 'Por iniciar', state: 'soon' }
      ],
      note: 'Orden de avance: años recientes → antiguo.'
    },
    FAENF_SILABOS_LANE
  ],
  footer: {
    text: 'El control de calidad y la auditoría de los sílabos digitados se desarrollan en el Flujo 5.',
    flow: 5, linkLabel: 'Ver Flujo 5 · Control de calidad'
  }
});

/* ============================================================
   FLUJO 5 · Control de calidad y gestión física
   ============================================================ */
FLOWS.push({
  n: 5,
  shortName: 'Control de calidad',
  fullName: 'Control de Calidad, Traslado y Eliminación Documental',
  groupLabel: 'Calidad',
  groups: ['calidad'],
  tone: '#1D4ED8', toneBg: '#E9EFFF',
  tagline: 'Auditoría de sílabos digitados, cotejo con el original, reporte Excel y resguardo digital.',
  people: ['sebastian'],
  systems: ['imaging', 'sheets'],
  duration: 'Auditoría por lote',
  frequency: 'Continua',
  status: 'Auditoría continua', statusTone: 'live',
  steps: [
    {
      id: 'f5s1', n: 1, title: 'Validación de metadatos de sílabos', owner: 'sebastian',
      systems: ['imaging'], time: 'Muestra diaria', icon: 'fa-circle-check',
      summary: 'Revisión de completitud y coincidencia de los metadatos del sílabo.',
      detail: 'Se revisa que los metadatos del sílabo digitado estén completos y coincidan con el documento original antes de continuar con el cotejo.',
      inputs: ['Sílabo digitado', 'Metadatos registrados'],
      outputs: ['Metadatos validados']
    },
    {
      id: 'f5s2', n: 2, title: 'Cotejo, corrección y reporte del sílabo', owner: 'sebastian',
      systems: ['sheets'], time: 'Diario', icon: 'fa-file-circle-check',
      summary: 'Comparación original vs. digitado, corrección y reporte Excel con apoyo de Python.',
      detail: 'Se compara el sílabo original con el digitado, se corrigen diferencias y se genera un reporte Excel. La revisión se apoya en un script en Python y librerías para detectar y aplicar mejoras de forma controlada.',
      inputs: ['Sílabo original', 'Sílabo digitado'],
      outputs: ['Sílabo corregido', 'Reporte Excel de auditoría']
    },
    {
      id: 'f5s3', n: 3, title: 'Guardado de sílabos auditados', owner: 'sebastian',
      systems: [], channel: 'Disco local + PenDrive', time: 'Al cierre de lote', icon: 'fa-hard-drive',
      summary: 'Respaldo en disco local y PenDrive antes de liberar el material.',
      detail: 'Los sílabos auditados se guardan en memoria en el disco local y en un PenDrive, manteniendo una copia de respaldo antes de liberar el material físico.',
      inputs: ['Sílabos auditados'],
      outputs: ['Copia en disco local', 'Respaldo en PenDrive']
    },
    {
      id: 'f5s4', n: 4, title: 'Eliminación de material archivístico', owner: 'sebastian',
      appearance: 'standard',
      systems: [], channel: 'Enlace · Flujo 2', time: 'Según lote', icon: 'fa-trash-can', linkFlow: 2,
      summary: 'Eliminación del material ya auditado y resguardado, con constancia.',
      detail: 'Se utiliza la trituradora para la destrucción física y eliminación del material que ya fue auditado y resguardado, siguiendo el procedimiento de eliminación documental y dejando constancia del lote eliminado.',
      inputs: ['Sílabos auditados y respaldados', 'Autorización de eliminación'],
      outputs: ['Material eliminado', 'Constancia de destrucción']
    },
    {
      id: 'f5s5', n: 5, title: 'Traslado y recojo de material físico', owner: 'sebastian',
      appearance: 'standard',
      systems: [], channel: 'Enlace · Flujo 2', time: 'Programado', icon: 'fa-truck-moving', linkFlow: 2,
      summary: 'Coordinación de cajas entre el Archivo Central y el Archivo FAMED.',
      detail: 'Se coordina el traslado y recojo de cajas entre el Almacén del Archivo Central y el Archivo FAMED, enlazando la gestión física con el Flujo 2 y dejando constancia del movimiento.',
      inputs: ['Inventario de cajas', 'Programación de recojo'],
      outputs: ['Cajas trasladadas o recuperadas', 'Constancia de movimiento']
    }
  ],
  bodySections: [
    { title: 'Control de Calidad', steps: ['f5s1', 'f5s2', 'f5s3'] },
    { title: 'Eliminacion de material documentario', steps: ['f5s4'] },
    { title: 'Traslado y Recojo de cajas Iron Mountain', steps: ['f5s5'] }
  ],
  footer: {
    text: 'Las salidas físicas de este flujo se conectan con el Flujo 2',
    flow: 2, linkLabel: 'Ver Flujo 2 · Gestión física'
  }
});

/* ============================================================
   FLUJO 6 · Historias clínicas CREO
   ============================================================ */
FLOWS.push({
  n: 6,
  shortName: 'Historias clínicas',
  fullName: 'Historias Clínicas · Clínica CREO',
  groupLabel: 'CREO',
  groups: ['historias'],
  tone: '#BE185D', toneBg: '#FDECF4',
  tagline: 'Custodia, préstamos, codificación, indexación física y archivo pasivo de historias clínicas con trazabilidad y acceso restringido.',
  people: ['lucero'],
  systems: ['sheets'],
  duration: 'Gestión permanente',
  frequency: 'A demanda',
  status: 'Operativo', statusTone: 'live',
  privacy: true,
  steps: [
    {
      id: 'f6s1', n: 1, title: 'Custodia de historias clínicas', owner: 'lucero',
      systems: [], channel: 'Clínica CREO', time: 'Permanente', icon: 'fa-shield-heart',
      summary: 'Control de acceso y ubicación física de cada expediente.',
      detail: 'Lucero mantiene la custodia física de las historias clínicas de la Clínica CREO, controlando el acceso y la ubicación de cada expediente.',
      inputs: ['Historia clínica recibida'],
      outputs: ['Expediente bajo custodia']
    },
    {
      id: 'f6s2', n: 2, title: 'Préstamos y trazabilidad', owner: 'lucero',
      systems: ['sheets'], time: 'A demanda', icon: 'fa-right-left',
      summary: 'Registro de préstamos y devoluciones con responsable y destino.',
      detail: 'Se registran préstamos y devoluciones con fecha, responsable y destino, asegurando la trazabilidad del expediente y su retorno oportuno al archivo.',
      inputs: ['Solicitud de préstamo', 'Expediente localizado'],
      outputs: ['Préstamo registrado', 'Devolución controlada']
    },
    {
      id: 'f6s3', n: 3, title: 'Codificación', owner: 'lucero',
      systems: [], time: 'Por lote', icon: 'fa-barcode',
      summary: 'Asignación del código único de identificación de la historia clínica.',
      detail: 'Se asigna el código de identificación a cada historia clínica según el esquema de la clínica, verificando que no existan duplicados y que el expediente corresponda al paciente.',
      inputs: ['Expediente validado'],
      outputs: ['Historia clínica codificada']
    },
    {
      id: 'f6s4', n: 4, title: 'Indexación física', owner: 'lucero',
      systems: ['sheets'], time: 'Por lote', icon: 'fa-folder-tree',
      summary: 'Ubicación en el archivador y actualización del índice.',
      detail: 'Se ubica cada expediente en el archivador físico correspondiente y se actualiza el índice para facilitar su recuperación y control.',
      inputs: ['Historia clínica codificada'],
      outputs: ['Expediente indexado', 'Índice actualizado']
    },
    {
      id: 'f6s5', n: 5, title: 'Archivo pasivo de HC', owner: 'lucero',
      systems: [], time: 'Permanente', icon: 'fa-box-archive',
      summary: 'Derivación de expedientes sin movimiento y conservación.',
      detail: 'Las historias clínicas sin movimiento se derivan al archivo pasivo, manteniendo condiciones de conservación y control de acceso.',
      inputs: ['Expediente sin movimiento'],
      outputs: ['Expediente en archivo pasivo']
    }
  ],
  footer: {
    text: 'Información sensible: acceso restringido, trazabilidad de préstamos y conservación física controlada.'
  }
});

/* ============================================================
   FLUJO 7 · Proyectos especiales
   ============================================================ */
FLOWS.push({
  n: 7,
  shortName: 'Proyectos especiales',
  fullName: 'Proyectos Especiales',
  groupLabel: 'Proyectos',
  groups: ['proyectos'],
  tone: '#171914', toneBg: '#EDE9DF',
  tagline: 'Dos frentes activos: la búsqueda histórica y consolidación de resoluciones académicas, y el despliegue del sistema de búsqueda para Secretaría General.',
  people: ['grace', 'yomira', 'klaudia', 'sebastian'],
  systems: ['fileserver', 'imaging', 'sheets'],
  duration: '2 proyectos activos',
  frequency: 'Por fases',
  status: 'En ejecución', statusTone: 'red',
  kind: 'projects',
  steps: [
    {
      id: 'f7s1', n: 1, title: 'Coordinar el proyecto y distribuir el trabajo', owner: 'yomira',
      support: ['grace', 'klaudia'],
      systems: [], channel: 'Reunión de equipo', time: 'Inicio', icon: 'fa-people-group',
      summary: 'Organización del equipo de Archivo y asignación de actividades.',
      detail: 'Se encarga el proyecto y se reúne al equipo de Archivo para distribuir las actividades entre Yomira, Grace y Klaudia, definiendo los bloques de revisión y los entregables.',
      inputs: ['Alcance del proyecto', 'Equipo de Archivo'],
      outputs: ['Actividades distribuidas', 'Cronograma de revisión']
    },
    {
      id: 'f7s2', n: 2, title: 'Recibir documentos y buscar resoluciones en ImagingSoft', owner: 'yomira',
      support: ['grace'],
      systems: ['imaging'], time: 'Continuo', icon: 'fa-magnifying-glass',
      summary: 'Recepción de los documentos de Martín Carbajo y búsqueda en ImagingSoft.',
      detail: 'Se reciben los documentos proporcionados por el Sr. Martín Carbajo y se realizan búsquedas de resoluciones en ImagingSoft, identificando los archivos que formarán parte del universo del proyecto.',
      inputs: ['Documentos proporcionados por Martín Carbajo', 'Criterios de búsqueda'],
      outputs: ['Resoluciones identificadas', 'Relación de archivos por revisar']
    },
    {
      id: 'f7s3', n: 3, title: 'Revisar, ordenar y clasificar las resoluciones', owner: 'yomira',
      support: ['grace'],
      systems: ['imaging'], time: 'Por bloque', icon: 'fa-layer-group',
      summary: 'Yomira y Grace revisan años distintos y clasifican por modalidad de admisión.',
      detail: 'Yomira y Grace revisan años distintos y organizan las resoluciones según las modalidades de admisión: reincorporación o reinicio, cambio de carrera, traslados internos y externos, talento y cambio de plan o carrera.',
      inputs: ['Resoluciones identificadas', 'Criterios de clasificación'],
      outputs: ['Resoluciones ordenadas y clasificadas']
    },
    {
      id: 'f7s3b', n: '3B', title: 'Preparar listados editables de alumnos en Excel', owner: 'klaudia',
      systems: ['sheets'], time: 'En paralelo', icon: 'fa-table-cells-large',
      summary: 'Listados editables para consolidar y comparar la información de alumnos.',
      detail: 'En paralelo, Klaudia prepara listados editables de alumnos en Excel para reunir la información y permitir su comparación posterior con la documentación de Secretaría Académica.',
      inputs: ['Indicaciones del proyecto'],
      outputs: ['Listados editables de alumnos en Excel']
    },
    {
      id: 'f7s4', n: 4, title: 'Digitalizar y organizar los archivos en Google Drive', owner: 'grace',
      support: ['yomira'],
      systems: ['sheets'], time: 'Por bloque', icon: 'fa-cloud-arrow-up',
      summary: 'Carga de resoluciones en carpetas por año y por modalidad.',
      detail: 'Se digitalizan y cargan las resoluciones en Google Drive, organizándolas en carpetas por año y por modalidad. Los anexos del documento muestran carpetas por año y una carpeta específica de reincorporación.',
      inputs: ['Resoluciones clasificadas'],
      outputs: ['Archivos organizados en Google Drive']
    },
    {
      id: 'f7s5', n: 5, title: 'Registrar las resoluciones y sus enlaces en la base de datos', owner: 'yomira',
      support: ['grace'],
      systems: ['sheets'], time: 'Por bloque', icon: 'fa-database',
      summary: 'Base de datos con identificación de resoluciones y enlaces directos.',
      detail: 'Se elabora una base de datos que identifica cada resolución e incorpora enlaces directos a los archivos almacenados en Drive, de modo que puedan localizarse rápidamente.',
      inputs: ['Archivos en Google Drive'],
      outputs: ['Base de datos de resoluciones', 'Enlaces directos a los archivos']
    },
    {
      id: 'f7s6', n: 6, title: 'Consolidar la información de alumnos en Excel', owner: 'klaudia',
      support: ['yomira', 'grace'],
      systems: ['sheets'], time: 'Al cierre de bloque', icon: 'fa-table-list',
      summary: 'Integración de la base documental y los listados editables.',
      detail: 'Se consolida en Excel la información de alumnos proveniente de los listados editables y de la base de datos de resoluciones, dejando un registro único para la comparación posterior.',
      inputs: ['Listados editables de alumnos', 'Base de datos de resoluciones'],
      outputs: ['Consolidado de alumnos en Excel']
    },
    {
      id: 'f7s7', n: 7, title: 'Comparar con el listado oficial de Secretaría Académica', owner: 'yomira',
      support: ['klaudia'],
      systems: ['sheets'], time: 'Validación', icon: 'fa-code-compare',
      summary: 'Cruce del consolidado con el listado oficial de Secretaría Académica.',
      detail: 'Se prevé cruzar los registros consolidados con el listado oficial de Secretaría Académica para verificar que la información de alumnos coincida con el documento de referencia.',
      inputs: ['Consolidado de alumnos', 'Listado oficial de Secretaría Académica'],
      outputs: ['Resultado del cruce de información']
    },
    {
      id: 'f7s8', n: 8, title: 'Identificar omisiones, duplicados e inconsistencias', owner: 'klaudia',
      support: ['yomira'],
      systems: ['sheets'], time: 'Validación', icon: 'fa-triangle-exclamation',
      summary: 'Detección de diferencias entre la documentación y el listado oficial.',
      detail: 'Se busca detectar posibles omisiones, duplicados e inconsistencias entre la documentación de archivo y el listado oficial, registrando cada diferencia para su revisión.',
      inputs: ['Resultado del cruce'],
      outputs: ['Lista de omisiones, duplicados e inconsistencias']
    },
    {
      id: 'f7s9', n: 9, title: 'Verificar los documentos y registrar observaciones', owner: 'grace',
      support: ['yomira', 'klaudia'],
      systems: ['imaging', 'sheets'], time: 'Validación', icon: 'fa-file-circle-check',
      summary: 'Revisión documental de cada diferencia y registro de observaciones.',
      detail: 'Se prevé verificar los documentos correspondientes a cada diferencia y registrar las observaciones encontradas, dejando constancia del sustento documental.',
      inputs: ['Lista de diferencias', 'Documentos digitalizados'],
      outputs: ['Documentos verificados', 'Observaciones registradas']
    },
    {
      id: 'f7s10', n: 10, title: 'Facilitar la consulta y entregar la documentación para titulación', owner: 'yomira',
      support: ['grace', 'klaudia'],
      systems: ['sheets'], time: 'Al cierre', icon: 'fa-graduation-cap',
      summary: 'Localización rápida de resoluciones y entrega para procesos de titulación.',
      detail: 'Se busca localizar y obtener rápidamente la documentación requerida durante los procesos de titulación, entregando el paquete documental verificado y su reporte de observaciones.',
      inputs: ['Documentación verificada', 'Base de datos con enlaces'],
      outputs: ['Paquete documental para titulación', 'Reporte de observaciones']
    },
    {
      id: 'f7s11', n: 'A1', title: 'Recopilar resoluciones con cronogramas de admisión', owner: 'grace',
      systems: ['imaging'], time: 'En revisión', icon: 'fa-calendar-days',
      summary: 'Identificación de las resoluciones que contienen cronogramas de admisión.',
      detail: 'Se recopilan las resoluciones que contienen cronogramas de admisión para incorporarlas como línea adicional del proyecto y facilitar su consulta posterior.',
      inputs: ['Resoluciones identificadas'],
      outputs: ['Relación de resoluciones con cronogramas']
    },
    {
      id: 'f7s12', n: 'A2', title: 'Clasificar por año y criterios', owner: 'grace',
      systems: ['imaging'], time: 'En revisión', icon: 'fa-layer-group',
      summary: 'Orden de los cronogramas según año y criterios de clasificación.',
      detail: 'Las resoluciones con cronogramas se clasifican por año y criterios, manteniendo el mismo orden documental utilizado en la ruta principal.',
      inputs: ['Relación de resoluciones con cronogramas'],
      outputs: ['Cronogramas clasificados por año']
    },
    {
      id: 'f7s13', n: 'A3', title: 'Subir los archivos a Google Drive', owner: 'grace',
      support: ['yomira'],
      systems: ['sheets'], time: 'En revisión', icon: 'fa-cloud-arrow-up',
      summary: 'Carga de los cronogramas clasificados en Google Drive.',
      detail: 'Los archivos de cronogramas se suben a Google Drive en las carpetas correspondientes por año, asegurando su disponibilidad para el equipo.',
      inputs: ['Cronogramas clasificados'],
      outputs: ['Cronogramas disponibles en Google Drive']
    },
    {
      id: 'f7s14', n: 'A4', title: 'Registrar en Sheets con enlaces directos', owner: 'grace',
      systems: ['sheets'], time: 'En revisión', icon: 'fa-link',
      summary: 'Base de datos en Sheets con enlaces para localizar los cronogramas.',
      detail: 'Se elabora la base de datos en Sheets y se incorporan enlaces directos a cada archivo, de modo que las resoluciones con cronogramas puedan localizarse rápidamente.',
      inputs: ['Cronogramas en Google Drive'],
      outputs: ['Base de datos en Sheets', 'Enlaces directos a los cronogramas']
    }
  ],
  projects: [
    {
      name: 'Búsqueda histórica de resoluciones',
      tag: 'Proyecto 01',
      status: 'En ejecución',
      icon: 'fa-magnifying-glass',
      tone: '#E71230',
      detail: true,
      description: 'Búsqueda, clasificación y consolidación de las resoluciones académicas de alumnos para compararlas con el listado oficial de Secretaría Académica y facilitar la entrega documental para titulación.',
      people: ['yomira', 'grace', 'klaudia'],
      systems: ['imaging', 'sheets'],
      time: '50%',
      timeNote: 'avance al 03/11/2026',
      scope: ['Reincorporación o reinicio', 'Cambio de carrera', 'Traslados internos y externos', 'Talento', 'Cambio de plan o carrera'],
      progress: {
        percent: 50,
        kicker: 'Avance reportado · 03/11/2026',
        title: '2,076 de 2,500 archivos de alumnos revisados',
        note: 'El porcentaje se conserva tal como fue reportado; el documento no explica cómo se calculó.',
        blocks: [
          { label: 'Primer bloque', note: 'Revisión completada', state: 'done' },
          { label: 'Segundo bloque', note: 'Recibido 29/10 · revisión iniciada 03/11', state: 'now' }
        ]
      },
      stepIds: ['f7s1', 'f7s2', 'f7s3', 'f7s4', 'f7s5', 'f7s6', 'f7s7', 'f7s8', 'f7s9', 'f7s10'],
      parallel: {
        kicker: 'En paralelo · Klaudia',
        stepId: 'f7s3b',
        join: 'Se integra en el paso 06',
        note: 'Klaudia prepara los listados editables de alumnos en Excel mientras Yomira y Grace revisan y clasifican las resoluciones. La consolidación del paso 06 reúne ambos trabajos.'
      },
      extra: {
        kicker: 'Línea adicional',
        title: 'Cronogramas de admisión',
        from: 'Se desprende del paso 02',
        status: 'En revisión',
        stepIds: ['f7s11', 'f7s12', 'f7s13', 'f7s14'],
        note: 'Una diapositiva identifica la tarea como pendiente; el reporte del 03/11/2026 indica que los documentos ya se recibieron y comenzó su revisión. La culminación del flujo completo no está confirmada.'
      },
      foot: 'Avance reportado al 03/11/2026 · primer bloque completado',
      footIcon: 'fa-chart-simple',
      link: {
        label: 'Ver presentación',
        url: 'https://docs.google.com/presentation/d/1o1XpB6k9HVBXSnFB117cwZA2waCymwqXlX4sCQdYduk/edit?usp=sharing'
      }
    },
    {
      name: 'Sistema de Búsqueda · Secretaría General',
      tag: 'Proyecto 02',
      status: 'Despliegue',
      icon: 'fa-window-restore',
      tone: '#9A6500',
      description: 'Diseño y despliegue de un buscador documental para Secretaría General, desde un MVP funcional hasta su puesta en producción.',
      people: ['sebastian'],
      systems: ['fileserver', 'sheets'],
      time: '8–10 días',
      timeNote: 'cierre objetivo: 10 días',
      scope: ['Buscador documental', 'Secretaría General', 'MVP → Producción'],
      phases: [
        { title: 'Fase 1 · Buscador MVP', desc: 'Base funcional y alcance mínimo' },
        { title: 'Fase 2a · Ajustes e implementación', desc: 'Iteración con usuarios' },
        { title: 'Fase 2b · Producción y despliegue', desc: 'Salida a operación' }
      ],
      foot: 'Cierre objetivo: 10 días hábiles',
      footIcon: 'fa-flag-checkered'
    }
  ],
  footer: {
    text: 'Proyecto 01: 50 % de avance reportado al 03/11/2026 (2,076 de 2,500 archivos de alumnos). Proyecto 02: 8–10 días, con cierre objetivo a 10 días.'
  }
});

/* ============================================================
   UTILIDADES
   ============================================================ */
const STEP_MAP = {};
FLOWS.forEach(flow => (flow.steps || []).forEach(step => {
  STEP_MAP[step.id] = Object.assign({}, step, { flowId: flow.n });
}));

const TOTAL_FLOWS = FLOWS.length;
const COLLABORATORS = Object.keys(PEOPLE).filter(id => !PEOPLE[id].lead);
const DIGITACION_FLOW = FLOWS.find(flow => flow.kind === 'digitacion');
const DIGITADORES = DIGITACION_FLOW
  ? DIGITACION_FLOW.people
  : Object.keys(PEOPLE).filter(id => PEOPLE[id].role === 'Digitadora');
const TOTAL_SYSTEMS = Object.keys(SYSTEMS).length;

const pad2 = n => String(n).padStart(2, '0');

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function avatar(id, cls) {
  const p = PEOPLE[id];
  if (!p) return '';
  return `<span class="avatar ${cls || ''}" style="--av:${p.color}" title="${esc(p.name)} · ${esc(p.role)}" aria-label="${esc(p.name)}">${esc(p.initials)}</span>`;
}

function personMini(id) {
  const p = PEOPLE[id];
  if (!p) return '';
  return `<span class="person-mini">${avatar(id, 'avatar--xs')}<span>${esc(p.name)}</span></span>`;
}

function sysIcon(id, small) {
  const s = SYSTEMS[id];
  if (!s) return '';
  return `<span class="sys-icon ${small ? 'sys-icon--sm' : ''}" role="img" style="--sc:${s.color};--sb:${s.bg}" title="${esc(s.name)} · ${esc(s.desc)}" aria-label="${esc(s.name)}"><i class="fa-solid ${esc(s.icon)}" aria-hidden="true"></i></span>`;
}

function systemChips(ids) {
  return (ids || []).map(id => {
    const s = SYSTEMS[id];
    if (!s) return '';
    return `<span class="dialog-sys">${sysIcon(id)}<span>${esc(s.name)}</span></span>`;
  }).join('');
}

function statusClass(tone) {
  if (tone === 'gold') return 'status-pill--gold';
  if (tone === 'red') return 'status-pill--red';
  return 'status-pill--live';
}

/* ============================================================
   RENDER · Pasos y conexiones
   ============================================================ */
function renderStepCard(step, options) {
  const opts = options || {};
  const ownerId = opts.owner || step.owner;
  const p = PEOPLE[ownerId];
  const support = (step.support || []).filter(id => id !== ownerId && PEOPLE[id]);
  const peopleIds = [ownerId, ...support].filter(id => PEOPLE[id]);
  const index = opts.n || step.n;
  const mods = [
    step.decision ? 'step-card--decision' : '',
    step.linkFlow && step.appearance !== 'standard' ? 'step-card--link' : '',
    opts.compact ? 'step-card--compact' : ''
  ].filter(Boolean).join(' ');
  const flag = step.decision
    ? '<span class="step-flag step-flag--gold">Decisión</span>'
    : step.linkFlow
      ? `<span class="step-flag ${step.appearance === 'standard' ? 'step-flag--gold' : 'step-flag--link'}">Enlace</span>`
      : '';
  const systemMarkup = step.systems && step.systems.length
    ? `<span class="step-systems">${step.systems.map(id => sysIcon(id, true)).join('')}</span>`
    : (step.channel ? `<span class="step-channel"><i class="fa-regular fa-circle-dot" aria-hidden="true"></i>${esc(step.channel)}</span>` : '');
  const accent = step.decision ? '#C58A00' : step.linkFlow && step.appearance !== 'standard' ? '#F8B800' : (p ? p.color : '#E71230');
  return `<button type="button" class="step-card ${mods}" data-step-id="${esc(step.id)}" data-owner="${esc(ownerId)}" data-n="${index}" data-matchable data-people="${esc(peopleIds.join(','))}" data-systems="${esc((step.systems || []).join(','))}" style="--step-accent:${accent}">
    <span class="step-top"><span class="step-index">${pad2(index)}</span><span class="step-icon"><i class="fa-solid ${esc(step.icon)}" aria-hidden="true"></i></span></span>
    ${flag}
    <span class="step-title">${esc(step.title)}</span>
    <span class="step-sub">${esc(step.summary || step.detail)}</span>
    <span class="step-foot">
      ${support.length
        ? `<span class="step-people">${p ? personMini(ownerId) : ''}${support.map(id => personMini(id)).join('')}</span>`
        : (p ? personMini(ownerId) : '')}
      ${systemMarkup}
      <span class="step-time"><i class="fa-regular fa-clock" aria-hidden="true"></i>${esc(step.time)}</span>
    </span>
  </button>`;
}

function renderTrack(stepIds, options) {
  const opts = options || {};
  const ids = stepIds || [];
  const shortClass = ids.length <= 3 ? 'flow-track--short' : '';
  return `<div class="track-shell track-shell--scroll is-start is-end" data-track-shell>
    <button type="button" class="track-nav track-nav--prev" data-track-prev aria-label="Ver pasos anteriores" disabled><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
    <div class="flow-track ${shortClass}" role="list" aria-label="Secuencia de pasos del flujo" tabindex="0">
      ${ids.map((id, index) => {
        const step = STEP_MAP[id];
        if (!step) return '';
        return `<div class="step-wrap" role="listitem">
          ${renderStepCard(step, { compact: opts.compact, owner: opts.owner, n: opts.renumber ? index + 1 : null })}
          ${index < ids.length - 1 ? '<span class="step-arrow" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>' : ''}
        </div>`;
      }).join('')}
    </div>
    <button type="button" class="track-nav track-nav--next" data-track-next aria-label="Ver pasos siguientes" disabled><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
  </div>`;
}

function renderBranchSteps(ids) {
  return `<div class="branch-steps">${ids.map((id, index) => {
    const step = STEP_MAP[id];
    if (!step) return '';
    return `<div class="step-wrap">${renderStepCard(step, { compact: true })}${index < ids.length - 1 ? '<span class="step-arrow" aria-hidden="true"><i class="fa-solid fa-chevron-right"></i></span>' : ''}</div>`;
  }).join('')}</div>`;
}

function renderBranches(flow) {
  return `<div class="branch-map">
    <div class="branch-head">
      <div>
        <span class="branch-kicker">Rutas de decisión</span>
        <h4>¿Qué ocurre después de la búsqueda?</h4>
      </div>
      <span class="branch-note"><i class="fa-solid fa-clock" aria-hidden="true"></i> Secretaría General: ~4 h de respuesta</span>
    </div>
    ${flow.branches.map(branch => {
      const yes = branch.tone === 'success';
      return `<div class="branch-row">
        <div class="branch-side">
          <span class="branch-tag ${yes ? 'branch-tag--yes' : 'branch-tag--no'}">${esc(branch.label)}</span>
          <span class="branch-side-label">${esc(branch.short)}</span>
        </div>
        <div class="branch-content">
          <div class="branch-condition">${esc(branch.condition)}</div>
          ${branch.stepIds && branch.stepIds.length ? renderBranchSteps(branch.stepIds) : ''}
          ${branch.outcome ? `<div class="branch-outcome"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>${esc(branch.outcome)}</div>` : ''}
          ${branch.subbranches ? `<div class="branch-sub">
            ${branch.subbranches.map(sub => {
              const subYes = sub.tone === 'success';
              if (sub.linkStep) {
                return `<div class="branch-subrow">
                  <span class="branch-sub-label"><span class="sub-tag ${subYes ? 'sub-tag--yes' : 'sub-tag--no'}">${esc(sub.label)}</span>${esc(sub.condition)}</span>
                  <button type="button" class="branch-link" data-step-id="${esc(sub.linkStep)}"><i class="fa-solid fa-arrow-turn-up" aria-hidden="true"></i>${esc(sub.linkLabel)}</button>
                </div>`;
              }
              return `<div class="branch-subrow">
                <span class="branch-sub-label"><span class="sub-tag ${subYes ? 'sub-tag--yes' : 'sub-tag--no'}">${esc(sub.label)}</span>${esc(sub.condition)}</span>
                ${sub.stepIds && sub.stepIds.length ? renderBranchSteps(sub.stepIds) : ''}
              </div>`;
            }).join('')}
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function renderCoverage(flow) {
  return `<div class="coverage">
    <div class="coverage-label"><span>Cobertura documental</span><strong>${flow.coverage.length} tipos de resoluciones</strong></div>
    <div class="coverage-chips">
      ${flow.coverage.map(item => `<span class="type-chip"><i class="fa-solid ${esc(item.icon)}" aria-hidden="true"></i>${esc(item.label)}</span>`).join('')}
    </div>
    <span class="coverage-frequency"><i class="fa-solid fa-rotate" aria-hidden="true"></i>Frecuencia ${esc((flow.frequency || '').toLowerCase())}</span>
  </div>`;
}

/* ============================================================
   RENDER · Flujo 4 · Digitación
   ============================================================ */
function rowStateMeta(row, fallback) {
  const state = row.state || fallback;
  return state === 'soon'
    ? { label: 'Pendiente', cls: 'soon' }
    : { label: 'En proceso', cls: 'now' };
}

function renderUnitCard(lane) {
  const headRows = (lane.headRows || []).map(row => {
    const meta = rowStateMeta(row, 'soon');
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        ${row.range ? `<span class="range">${esc(row.range)}</span>` : ''}
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const currentRows = (lane.current || []).map(row => {
    const meta = rowStateMeta(row, 'now');
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        <span class="range">${esc(row.range)}</span>
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const pendingRows = (lane.pending || []).map(row => {
    const meta = rowStateMeta(row, 'soon');
    const sys = row.system ? SYSTEMS[row.system] : null;
    return `
      <div class="status-row">
        <span class="label">${esc(row.label)}</span>
        ${sys ? `<span class="sys-inline"><i class="fa-solid ${esc(sys.icon)}" aria-hidden="true"></i>${esc(sys.name)}</span>` : ''}
        ${row.range ? `<span class="range">${esc(row.range)}</span>` : ''}
        <span class="${meta.cls}">${meta.label}</span>
      </div>`;
  }).join('');
  const statusTone = lane.statusTone === 'soon' ? ' unit-status--soon' : '';
  return `<article class="unit-card" data-matchable data-people="${esc(lane.team.join(','))}" data-systems="${esc(lane.systems.join(','))}" style="--unit:${lane.color};--unit-bg:${lane.bg}">
      <div class="unit-head">
        <div class="unit-title-wrap">
          <span class="unit-icon" aria-hidden="true"><i class="fa-solid ${esc(lane.icon)}"></i></span>
          <span>
            <span class="unit-tag">${esc(lane.subtitle)}</span>
            <span class="unit-title">${esc(lane.title)}</span>
          </span>
        </div>
        <span class="unit-status${statusTone}"><span class="dot"></span>${esc(lane.status || 'En proceso')}</span>
      </div>
      <div class="unit-team">
        ${lane.team.map(id => {
          const p = PEOPLE[id];
          if (!p) return '';
          return `<span class="team-chip">${avatar(id, 'avatar--xs')}${esc(p.name)}</span>`;
        }).join('')}
      </div>
      ${headRows ? `<div class="unit-block">
        ${headRows}
      </div>` : ''}
      ${currentRows ? `<div class="unit-block">
        <div class="unit-block-title"><i class="fa-solid fa-play" aria-hidden="true"></i>En proceso</div>
        ${currentRows}
      </div>` : ''}
      ${pendingRows ? `<div class="unit-block">
        <div class="unit-block-title"><i class="fa-solid fa-hourglass-half" aria-hidden="true"></i>Pendiente por iniciar</div>
        ${pendingRows}
      </div>` : ''}
      ${lane.note ? `<div class="unit-note"><i class="fa-solid fa-arrow-down-wide-short" aria-hidden="true"></i><span>${esc(lane.note)}</span></div>` : ''}
    </article>`;
}

function renderDigitacion(flow) {
  const lanes = flow.lanes.map(lane => renderUnitCard(lane)).join('');
  return `<div class="digit-band">
    <div class="digit-target"><span class="mono">Meta diaria</span><strong>25–30</strong><small>hojas/día</small></div>
    <span class="digit-band-divider" aria-hidden="true"></span>
    <div class="digit-band-note"><i class="fa-solid fa-users" aria-hidden="true"></i><span><b>${DIGITADORES.length} digitadores</b> · FAMED y FAENF</span></div>
    <div class="digit-sequence">
      <span class="digit-seq-step"><b>01</b> Preparación</span>
      <span class="digit-seq-arrow"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>
      <span class="digit-seq-step"><b>02</b> Digitación</span>
      <span class="digit-seq-arrow"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></span>
      <span class="digit-seq-step"><b>03</b> Calidad · Flujo 5</span>
    </div>
  </div>
  <div class="digit-grid">${lanes}</div>
  <div class="digit-footer">
    <span><i class="fa-solid fa-arrow-right-long" aria-hidden="true"></i> FAMED avanza de años recientes a antiguos; FAENF continúa con escaneo e indexación.</span>
    <button type="button" class="inline-link" data-goto-flow="5">Ver Flujo 5 · Control de calidad <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
  </div>`;
}

/* ============================================================
   RENDER · Flujo 7 · Proyectos
   ============================================================ */
function projectHead(project) {
  return `<div class="project-head">
    <span class="project-icon" aria-hidden="true"><i class="fa-solid ${esc(project.icon)}"></i></span>
    <div class="project-copy">
      <span class="project-tag">${esc(project.tag)} · ${esc(project.status)}</span>
      <h4 class="project-title">${esc(project.name)}</h4>
      <p class="project-desc">${esc(project.description)}</p>
    </div>
    <div class="project-time">
      <i class="fa-regular fa-clock" aria-hidden="true"></i>
      <strong>${esc(project.time)}</strong>
      ${project.timeNote ? `<small>${esc(project.timeNote)}</small>` : ''}
    </div>
  </div>`;
}

function projectMeta(project) {
  return `<div class="project-meta">
    <span class="project-team">
      ${project.people.map(id => {
        const p = PEOPLE[id];
        if (!p) return '';
        return `<span class="project-person">${avatar(id, 'avatar--xs')}${esc(p.name)}</span>`;
      }).join('')}
    </span>
    <span class="project-systems">${project.systems.map(id => sysIcon(id, true)).join('')}</span>
  </div>`;
}

function projectScope(project) {
  return `<div class="project-scope">
    <span class="scope-label">Alcance</span>
    ${project.scope.map(item => `<span class="scope-chip">${esc(item)}</span>`).join('')}
  </div>`;
}

function projectFoot(project) {
  return `<div class="project-foot">
    <span><i class="fa-solid fa-circle-check" aria-hidden="true"></i>${esc(project.foot)}</span>
    <span class="project-foot-actions">
      ${project.link ? `<a class="project-link" href="${esc(project.link.url)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-google-drive" aria-hidden="true"></i>${esc(project.link.label)}</a>` : ''}
      <span class="close-date"><i class="fa-solid ${esc(project.footIcon)}" aria-hidden="true"></i>${esc(project.status)}</span>
    </span>
  </div>`;
}

function renderProjectProgress(progress) {
  if (!progress) return '';
  const percent = Number(progress.percent) || 0;
  return `<div class="project-progress" style="--p:${percent}">
    <div class="progress-dial" role="img" aria-label="${percent}% de avance reportado">
      <span class="progress-value">${percent}<small>%</small></span>
    </div>
    <div class="progress-main">
      <span class="progress-kicker">${esc(progress.kicker)}</span>
      <strong class="progress-title">${esc(progress.title)}</strong>
      <div class="progress-track" aria-hidden="true"><span></span></div>
      <span class="progress-note">${esc(progress.note)}</span>
    </div>
    <div class="progress-blocks">
      ${progress.blocks.map(block => `<span class="progress-block progress-block--${esc(block.state)}"><span class="progress-block-dot"></span><span><b>${esc(block.label)}</b><small>${esc(block.note)}</small></span></span>`).join('')}
    </div>
  </div>`;
}

function renderProjectLane(lane) {
  if (!lane) return '';
  const step = STEP_MAP[lane.stepId];
  if (!step) return '';
  const peopleIds = [step.owner, ...(step.support || [])].filter(id => PEOPLE[id]);
  return `<div class="project-lane" data-matchable data-people="${esc(peopleIds.join(','))}" data-systems="${esc((step.systems || []).join(','))}">
    <div class="project-lane-head">
      <span class="project-lane-kicker"><i class="fa-solid fa-code-branch" aria-hidden="true"></i>${esc(lane.kicker)}</span>
      <span class="project-lane-join"><i class="fa-solid fa-arrow-right-to-bracket" aria-hidden="true"></i>${esc(lane.join)}</span>
    </div>
    <div class="project-lane-body">
      ${renderStepCard(step, { compact: true })}
      <p class="project-lane-note">${esc(lane.note)}</p>
    </div>
  </div>`;
}

function renderProjectExtra(extra) {
  if (!extra) return '';
  return `<div class="project-extra">
    <div class="project-extra-head">
      <span class="project-extra-kicker"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i>${esc(extra.kicker)}</span>
      <span class="project-extra-title">${esc(extra.title)}</span>
      <span class="project-extra-from">${esc(extra.from)}</span>
      <span class="project-extra-status"><span class="dot"></span>${esc(extra.status)}</span>
    </div>
    ${renderTrack(extra.stepIds, { compact: true })}
    <p class="project-extra-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i>${esc(extra.note)}</p>
  </div>`;
}

function renderProjectCompact(project) {
  return `<article class="project-card" data-matchable data-people="${esc(project.people.join(','))}" data-systems="${esc(project.systems.join(','))}" style="--tone:${project.tone}">
    ${projectHead(project)}
    ${projectMeta(project)}
    ${projectScope(project)}
    <div class="project-phases">
      ${project.phases.map((phase, i) => `<div class="phase">
        <span class="phase-num">FASE ${pad2(i + 1)}</span>
        <span class="phase-title">${esc(phase.title)}</span>
        <span class="phase-desc">${esc(phase.desc)}</span>
      </div>`).join('')}
    </div>
    ${projectFoot(project)}
  </article>`;
}

function renderProjectDetail(project) {
  const stepCount = (project.stepIds || []).length;
  return `<article class="project-card project-card--detail" data-matchable data-people="${esc(project.people.join(','))}" data-systems="${esc(project.systems.join(','))}" style="--tone:${project.tone}">
    ${projectHead(project)}
    ${projectMeta(project)}
    ${projectScope(project)}
    <div class="project-detail">
      ${renderProjectProgress(project.progress)}
      <div class="project-flow-block">
        <div class="project-block-head">
          <span class="project-block-title"><i class="fa-solid fa-route" aria-hidden="true"></i>Ruta principal</span>
          <span class="project-block-count">${stepCount} pasos</span>
        </div>
        ${renderTrack(project.stepIds)}
      </div>
      ${renderProjectLane(project.parallel)}
      ${renderProjectExtra(project.extra)}
    </div>
    ${projectFoot(project)}
  </article>`;
}

function renderProjects(flow) {
  return `<div class="project-grid">
    ${flow.projects.map(project => (project.detail ? renderProjectDetail(project) : renderProjectCompact(project))).join('')}
  </div>`;
}

/* ============================================================
   RENDER · Tarjeta de flujo
   ============================================================ */
function renderBodySection(flow, section) {
  if (section.card) {
    return `<div class="flow-body-inner">
      ${renderUnitCard(section.card)}
    </div>`;
  }
  let inner;
  if (section.steps) {
    inner = renderTrack(section.steps, { owner: section.owner, renumber: section.renumber });
  } else {
    inner = renderTrack(flow.mainSteps || (flow.steps || []).map(step => step.id));
    if (flow.branches) inner += renderBranches(flow);
    if (flow.coverage) inner += renderCoverage(flow);
  }
  const total = section.steps ? section.steps.length : (flow.mainSteps || flow.steps || []).length;
  const head = section.title ? `<div class="flow-section-head">
      <span class="flow-section-title">${esc(section.title)}</span>
      ${section.period ? `<span class="flow-section-title">${esc(section.period)}</span>` : ''}
      <span class="flow-section-count">${total} pasos</span>
    </div>` : '';
  return `<div class="flow-body-inner">
    ${head}
    ${inner}
  </div>`;
}

function renderFlowBody(flow) {
  if (flow.kind === 'digitacion') return renderDigitacion(flow);
  if (flow.kind === 'projects') return renderProjects(flow);
  if (flow.bodySections) return flow.bodySections.map(section => renderBodySection(flow, section)).join('');
  let html = renderTrack(flow.mainSteps || (flow.steps || []).map(step => step.id));
  if (flow.branches) html += renderBranches(flow);
  if (flow.coverage) html += renderCoverage(flow);
  return html;
}

function renderFlow(flow) {
  const countLabel = flow.kind === 'digitacion'
    ? `${flow.lanes.length} líneas`
    : flow.kind === 'projects'
      ? `${flow.projects.length} proyectos`
      : `${flow.steps.length} pasos`;
  const systems = flow.systems.map(id => sysIcon(id, true)).join('');
  const footer = flow.footer
    ? `<div class="flow-footer">
        <span><i class="fa-solid fa-circle-info" aria-hidden="true"></i>${esc(flow.footer.text)}</span>
        ${flow.footer.flow ? `<button type="button" class="inline-link" data-goto-flow="${esc(flow.footer.flow)}">${esc(flow.footer.linkLabel)} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : ''}
      </div>`
    : '';
  return `<details class="flow-card" id="flujo-${Number(flow.n)}" data-flow="${Number(flow.n)}" style="--tone:${flow.tone};--tone-bg:${flow.toneBg}" open>
    <summary class="flow-summary">
      <span class="flow-id">${pad2(flow.n)}</span>
      <span class="flow-head-copy">
        <span class="flow-kicker">Flujo ${pad2(flow.n)} · ${esc(flow.groupLabel)}</span>
        <span class="flow-title" role="heading" aria-level="3">${esc(flow.fullName)}</span>
        <span class="flow-desc">${esc(flow.tagline)}</span>
        <span class="flow-tags">
          <span class="status-pill ${statusClass(flow.statusTone)}"><span class="dot"></span>${esc(flow.status)}</span>
          ${flow.privacy ? '<span class="status-pill status-pill--red"><i class="fa-solid fa-lock" aria-hidden="true"></i>Acceso restringido</span>' : ''}
          <span class="meta-chip"><i class="fa-regular fa-clock" aria-hidden="true"></i>${esc(flow.duration)}</span>
          <span class="meta-chip"><i class="fa-solid fa-rotate" aria-hidden="true"></i>${esc(flow.frequency)}</span>
          ${flow.frequencyAlt ? `<span class="meta-chip"><i class="fa-solid fa-rotate" aria-hidden="true"></i>${esc(flow.frequencyAlt)}</span>` : ''}
        </span>
      </span>
      <span class="flow-side">
        <span class="flow-side-row">
          <span class="avatar-stack avatar-stack--sm" aria-label="Responsables del flujo">${flow.people.map(id => avatar(id)).join('')}</span>
          <span class="flow-count">${countLabel}</span>
        </span>
        <span class="flow-side-row flow-side-systems">${systems}</span>
        <span class="flow-toggle"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></span>
      </span>
    </summary>
    <div class="flow-body">
      ${flow.inventory ? `<div class="flow-body-inner">
        <article class="step-card inventory-card" data-matchable data-people="${esc(flow.inventory.owner)}" data-systems="sheets">
          <div class="step-top"><span class="step-icon"><i class="fa-solid fa-boxes-stacked" aria-hidden="true"></i></span></div>
          <h4 class="step-title">Inventarios</h4>
          <div class="inventory-owner"><span>Encargada:</span>${personMini(flow.inventory.owner)}</div>
          <div class="inventory-links">
            ${flow.inventory.links.map(link => `<a class="project-link" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-google-drive" aria-hidden="true"></i>${esc(link.label)}</a>`).join('')}
          </div>
        </article>
      </div>` : ''}
      ${flow.bodySections ? renderFlowBody(flow) : `<div class="flow-body-inner">${renderFlowBody(flow)}</div>`}
      ${footer}
    </div>
  </details>`;
}


/* ============================================================
   ESTADO Y FILTROS
   ============================================================ */
const state = {
  process: 'all',
  people: new Set(),
  systems: new Set()
};

const $ = (selector, root) => (root || document).querySelector(selector);
const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

function hasActiveFilters() {
  return state.process !== 'all' || state.people.size > 0 || state.systems.size > 0;
}

function hasEntityFilters() {
  return state.people.size > 0 || state.systems.size > 0;
}

function filteredFlows() {
  return FLOWS.filter(flow => {
    if (state.process !== 'all' && !flow.groups.includes(state.process)) return false;
    if (state.people.size && !flow.people.some(id => state.people.has(id))) return false;
    if (state.systems.size && !flow.systems.some(id => state.systems.has(id))) return false;
    return true;
  });
}

function renderAllOption(group, title, hint) {
  const selected = group === 'process'
    ? state.process === 'all'
    : group === 'people'
      ? state.people.size === 0
      : state.systems.size === 0;
  return `<button type="button" class="filter-option" role="option" data-filter="${esc(group)}" data-value="all" aria-selected="${selected}">
    <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
    <span class="option-label"><strong>${esc(title)}</strong><small>${esc(hint)}</small></span>
  </button>`;
}

function renderProcessMenu() {
  const menu = $('#menu-process');
  menu.innerHTML = `${PROCESS_OPTIONS.map(option => {
    const hint = option.value === 'all' ? `Mapa completo · ${TOTAL_FLOWS} flujos` : option.hint;
    return `
    <button type="button" class="filter-option" role="option" data-filter="process" data-value="${esc(option.value)}" aria-selected="${option.value === state.process}">
      <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
      <span class="option-label"><strong>${esc(option.label)}</strong><small>${esc(hint)}</small></span>
      ${option.color ? `<span class="option-dot" style="background:${option.color}"></span>` : ''}
    </button>`;
  }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección única</span><button type="button" class="menu-clear" data-clear-group="process">Mostrar todos</button></div>`;
}

function renderPeopleMenu() {
  const menu = $('#menu-people');
  menu.innerHTML = `
    ${renderAllOption('people', 'Todo el equipo', `${Object.keys(PEOPLE).length} personas · incluye supervisión`)}
    ${Object.keys(PEOPLE).map(id => {
      const p = PEOPLE[id];
      return `<button type="button" class="filter-option" role="option" data-filter="people" data-value="${esc(id)}" aria-selected="${state.people.has(id)}">
        <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        ${avatar(id, 'avatar--md')}
        <span class="option-label"><strong>${esc(p.name)}</strong><small>${esc(p.role)}</small></span>
      </button>`;
    }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección múltiple</span><button type="button" class="menu-clear" data-clear-group="people">Limpiar</button></div>`;
}

function renderSystemsMenu() {
  const menu = $('#menu-systems');
  menu.innerHTML = `
    ${renderAllOption('systems', 'Todos los sistemas', Object.keys(SYSTEMS).map(id => SYSTEMS[id].name).join(' · '))}
    ${Object.keys(SYSTEMS).map(id => {
      const s = SYSTEMS[id];
      return `<button type="button" class="filter-option" role="option" data-filter="systems" data-value="${esc(id)}" aria-selected="${state.systems.has(id)}">
        <span class="option-check"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
        <span class="sys-icon" style="--sc:${s.color};--sb:${s.bg}"><i class="fa-solid ${esc(s.icon)}" aria-hidden="true"></i></span>
        <span class="option-label"><strong>${esc(s.name)}</strong><small>${esc(s.desc)}</small></span>
      </button>`;
    }).join('')}
    <div class="filter-menu-foot"><span class="filter-menu-note">Selección múltiple</span><button type="button" class="menu-clear" data-clear-group="systems">Limpiar</button></div>`;
}

function selectedProcess() {
  return PROCESS_OPTIONS.find(option => option.value === state.process) || PROCESS_OPTIONS[0];
}

function syncFilterUI() {
  const process = selectedProcess();
  $('#value-process').textContent = process.label;

  const peopleCount = state.people.size;
  const peopleNames = Array.from(state.people).map(id => (PEOPLE[id] ? PEOPLE[id].name : '')).filter(Boolean);
  $('#value-people').textContent = peopleCount === 0
    ? 'Todo el equipo'
    : peopleCount === 1 ? (peopleNames[0] || '1 responsable') : `${peopleCount} responsables`;
  $('#count-people').textContent = peopleCount;
  $('#count-people').hidden = peopleCount === 0;

  const systemCount = state.systems.size;
  const systemNames = Array.from(state.systems).map(id => (SYSTEMS[id] ? SYSTEMS[id].name : '')).filter(Boolean);
  $('#value-systems').textContent = systemCount === 0
    ? 'Todos los sistemas'
    : systemCount === 1 ? (systemNames[0] || '1 sistema') : `${systemCount} sistemas`;
  $('#count-systems').textContent = systemCount;
  $('#count-systems').hidden = systemCount === 0;

  $('#trigger-process').classList.toggle('is-active', state.process !== 'all');
  $('#trigger-people').classList.toggle('is-active', peopleCount > 0);
  $('#trigger-systems').classList.toggle('is-active', systemCount > 0);

  $$('.filter-option').forEach(option => {
    const group = option.dataset.filter;
    const value = option.dataset.value;
    const selected = group === 'process'
      ? state.process === value
      : group === 'people'
        ? (value === 'all' ? state.people.size === 0 : state.people.has(value))
        : (value === 'all' ? state.systems.size === 0 : state.systems.has(value));
    option.setAttribute('aria-selected', String(selected));
  });
}

function renderChips() {
  const holder = $('#activeChips');
  if (!hasActiveFilters()) {
    holder.innerHTML = '<span class="filter-idle"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>Sin filtros activos · mapa completo</span>';
    return;
  }
  const chips = [];
  if (state.process !== 'all') {
    const process = selectedProcess();
    chips.push(`<button type="button" class="filter-chip" data-chip-type="process" data-chip-value="${esc(state.process)}" aria-label="Quitar filtro de proceso ${esc(process.label)}"><span class="chip-dot" style="background:${process.color || '#171914'}"></span>${esc(process.label)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  }
  state.people.forEach(id => {
    const p = PEOPLE[id];
    if (!p) return;
    chips.push(`<button type="button" class="filter-chip" data-chip-type="people" data-chip-value="${esc(id)}" aria-label="Quitar filtro de ${esc(p.name)}"><span class="chip-dot" style="background:${p.color}"></span>${esc(p.name)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  });
  state.systems.forEach(id => {
    const s = SYSTEMS[id];
    if (!s) return;
    chips.push(`<button type="button" class="filter-chip" data-chip-type="systems" data-chip-value="${esc(id)}" aria-label="Quitar filtro de sistema ${esc(s.name)}"><i class="fa-solid ${esc(s.icon)}" style="color:${s.color}" aria-hidden="true"></i>${esc(s.name)}<i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`);
  });
  holder.innerHTML = chips.join('');
}

function dimMatchables() {
  const active = hasEntityFilters();
  $$('[data-matchable]').forEach(el => {
    if (!active) {
      el.classList.remove('is-muted');
      return;
    }
    const people = (el.dataset.people || '').split(',').filter(Boolean);
    const systems = (el.dataset.systems || '').split(',').filter(Boolean);
    const peopleMatch = state.people.size === 0 || people.some(id => state.people.has(id));
    const systemMatch = state.systems.size === 0 || systems.some(id => state.systems.has(id));
    el.classList.toggle('is-muted', !(peopleMatch && systemMatch));
  });
}

function printFilterSummary(visibleCount) {
  if (!hasActiveFilters()) {
    return `Mapa completo · ${TOTAL_FLOWS} flujos · sin filtros aplicados`;
  }
  const parts = [];
  if (state.process !== 'all') parts.push(`Proceso: ${selectedProcess().label}`);
  if (state.people.size) {
    const names = Array.from(state.people).map(id => (PEOPLE[id] ? PEOPLE[id].name : '')).filter(Boolean);
    if (names.length) parts.push(`Personas: ${names.join(', ')}`);
  }
  if (state.systems.size) {
    const names = Array.from(state.systems).map(id => (SYSTEMS[id] ? SYSTEMS[id].name : '')).filter(Boolean);
    if (names.length) parts.push(`Sistemas: ${names.join(', ')}`);
  }
  return `Filtros aplicados: ${parts.join(' · ')} · ${visibleCount} de ${TOTAL_FLOWS} flujos visibles`;
}

function applyFilters() {
  const visible = filteredFlows();
  const visibleIds = new Set(visible.map(flow => flow.n));
  const active = hasActiveFilters();

  $$('#flowsList .flow-card').forEach(card => {
    const show = visibleIds.has(Number(card.dataset.flow));
    card.hidden = !show;
    if (show && active) card.open = true;
  });

  $$('#flowIndexList .index-link').forEach(link => {
    link.hidden = !visibleIds.has(Number(link.dataset.flowLink));
  });

  $('#emptyState').hidden = visible.length !== 0;

  $('#indexCount').textContent = `${visible.length}/${TOTAL_FLOWS}`;
  $('#resultsNote').innerHTML = `<strong>${visible.length}</strong> de ${TOTAL_FLOWS} procesos visibles`;
  $('#printFilterNote').textContent = printFilterSummary(visible.length);
  $('#filterResult').classList.toggle('is-filtered', hasEntityFilters());

  dimMatchables();
  renderChips();
  syncFilterUI();
}

function clearFilters() {
  state.process = 'all';
  state.people.clear();
  state.systems.clear();
  applyFilters();
  closeAllDropdowns();
}

/* ============================================================
   RENDER · Índice, equipo y KPI
   ============================================================ */
function renderIndex() {
  $('#flowIndexList').innerHTML = FLOWS.map(flow => `
    <a href="#flujo-${Number(flow.n)}" class="index-link" data-flow-link="${Number(flow.n)}">
      <span class="index-num">${pad2(flow.n)}</span>
      <span class="index-copy">
        <span class="index-name">${esc(flow.shortName)}</span>
        <span class="index-people">
          ${flow.people.map(id => {
            const p = PEOPLE[id];
            if (!p) return '';
            return `<span class="index-dot" style="--c:${p.color}" title="${esc(p.name)}"></span>`;
          }).join('')}
          <span>${flow.people.length} resp.</span>
        </span>
      </span>
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </a>`).join('');
}

function flowsForPerson(id) {
  return FLOWS.filter(flow => flow.people.includes(id));
}

function renderTeam() {
  const grid = $('#teamGrid');
  grid.innerHTML = Object.keys(PEOPLE).map(id => {
    const p = PEOPLE[id];
    const flows = flowsForPerson(id);
    const systems = Array.from(new Set(flows.flatMap(flow => flow.systems)));
    return `<button type="button" class="person-card ${p.lead ? 'person-card--lead' : ''}" data-person-filter="${esc(id)}" style="--pc:${p.color};--pc-bg:${p.bg}">
      <span class="person-cta"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></span>
      <span class="person-avatar">${esc(p.initials)}</span>
      <span class="person-name">${esc(p.name)}</span>
      <span class="person-role">${esc(p.role)}</span>
      ${p.lead ? '<span class="supervisor-badge"><i class="fa-solid fa-star" aria-hidden="true"></i>Supervisión</span>' : ''}
      <span class="person-desc">${esc(p.desc)}</span>
      <span class="person-flows">${flows.map(flow => `<span class="flow-mini">${esc(flow.shortName)}</span>`).join('')}</span>
      <span class="person-foot">
        <span class="person-systems">${systems.map(sysId => sysIcon(sysId, true)).join('')}</span>
        <span>${flows.length} ${flows.length === 1 ? 'flujo' : 'flujos'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </span>
    </button>`;
  }).join('');
}

function renderKpiAvatars() {
  $('#kpiAvatars').innerHTML = COLLABORATORS.map(id => avatar(id)).join('');
}

function renderFooterSystems() {
  const list = $('#footerSystems');
  if (!list) return;
  list.innerHTML = Object.keys(SYSTEMS).map(id => {
    const s = SYSTEMS[id];
    return `<div class="footer-row"><i class="fa-solid ${esc(s.icon)}" aria-hidden="true"></i><span><b>${esc(s.name)}</b><br>${esc(s.desc)}</span></div>`;
  }).join('');
}

function renderHeadCounts() {
  const supervisors = Object.keys(PEOPLE).length - COLLABORATORS.length;
  const projects = FLOWS.filter(flow => flow.kind === 'projects')
    .reduce((total, flow) => total + (flow.projects || []).length, 0);
  const setText = (selector, value) => {
    const node = $(selector);
    if (node) node.textContent = value;
  };
  setText('#metaFlowCount', TOTAL_FLOWS);
  setText('#metaTeamCount', COLLABORATORS.length);
  setText('#orbitFlowCount', pad2(TOTAL_FLOWS));
  setText('#orbitSubline', `${TOTAL_SYSTEMS} sistemas · ${projects} proyectos`);
  setText('#kpiTeamCount', COLLABORATORS.length);
  setText('#flowsEyebrowCount', TOTAL_FLOWS);
  setText('#statCollaborators', COLLABORATORS.length);
  setText('#statSupervisors', supervisors);
  setText('#statDigitadores', DIGITADORES.length);
}

/* ============================================================
   MODAL DE DETALLE
   ============================================================ */
let lastDialogTrigger = null;

function openStep(id, ownerOverride, nOverride) {
  const step = STEP_MAP[id];
  if (!step) return;
  const flow = FLOWS.find(item => item.n === step.flowId);
  if (!flow) return;
  const ownerId = ownerOverride && PEOPLE[ownerOverride] ? ownerOverride : step.owner;
  const stepNumber = Number(nOverride) > 0 ? Number(nOverride) : step.n;
  const p = PEOPLE[ownerId];
  const ownerName = p ? p.name : 'Sin responsable';
  const ownerRole = p ? p.role : 'No asignado';
  const support = (step.support || []).filter(id => id !== ownerId && PEOPLE[id]);
  const supportNames = support.map(id => PEOPLE[id].name).join(' · ');
  const tone = step.decision ? '#C58A00' : step.linkFlow && step.appearance !== 'standard' ? '#F8B800' : (p ? p.color : '#E71230');
  const typeLabel = step.decision ? 'Punto de decisión' : step.linkFlow ? 'Enlace operativo' : 'Paso operativo';
  const systems = step.systems && step.systems.length
    ? `<span class="dialog-fact-value">${systemChips(step.systems)}</span>`
    : step.channel
      ? `<span class="dialog-fact-value"><i class="fa-regular fa-circle-dot" style="color:#9A6500;font-size:8px" aria-hidden="true"></i>${esc(step.channel)}</span>`
      : `<span class="dialog-fact-value"><span class="dialog-none">Sin sistema asociado</span></span>`;
  const systemsLabel = step.systems && step.systems.length ? 'Sistemas' : step.channel ? 'Canal' : 'Sistemas';
  const io = (step.inputs && step.inputs.length) || (step.outputs && step.outputs.length)
    ? `<div class="dialog-io">
        <div>
          <div class="dialog-io-title"><i class="fa-solid fa-arrow-right-to-bracket" aria-hidden="true"></i>Entradas</div>
          <ul>${(step.inputs || ['No especificadas']).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="dialog-io-title"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>Salidas</div>
          <ul>${(step.outputs || ['No especificadas']).map(item => `<li>${esc(item)}</li>`).join('')}</ul>
        </div>
      </div>`
    : '';
  const decisionCallout = step.decision
    ? `<div class="dialog-callout dialog-callout--gold"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><div><strong>Punto de decisión</strong><span>La ruta siguiente depende del resultado de este control. Revisa las ramas del flujo para continuar.</span></div></div>`
    : '';
  const linkCallout = step.linkFlow
    ? `<div class="dialog-callout dialog-callout--link"><i class="fa-solid fa-link" aria-hidden="true"></i><div><strong>Enlace con el Flujo ${pad2(step.linkFlow)}</strong><span>Este paso conecta la gestión digital con la operación física del archivo.</span></div></div>`
    : '';
  const noticeCallout = step.notice
    ? `<div class="dialog-callout dialog-callout--${esc(step.notice.tone || 'gold')}"><i class="fa-solid ${esc(step.notice.icon || 'fa-circle-info')}" aria-hidden="true"></i><div><strong>${esc(step.notice.title)}</strong><span>${esc(step.notice.text)}</span></div></div>`
    : '';
  const cta = step.linkFlow
    ? `<button type="button" class="dialog-cta" data-goto-flow="${esc(step.linkFlow)}"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>Ir al Flujo ${pad2(step.linkFlow)}</button>`
    : `<button type="button" class="dialog-cta" data-close-dialog>Cerrar detalle</button>`;

  lastDialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  $('#dialogContent').innerHTML = `
    <div class="dialog-top" style="--tone:${tone}">
      <span class="dialog-kicker">Flujo ${pad2(flow.n)} · Paso ${pad2(stepNumber)} · ${typeLabel}</span>
      <h3 class="dialog-title" id="dialogTitle">${esc(step.title)}</h3>
      <p class="dialog-flow">${esc(flow.fullName)} · ${esc(flow.groupLabel)}</p>
    </div>
    <div class="dialog-body">
      <p class="dialog-desc">${esc(step.detail)}</p>
      <div class="dialog-grid">
        <div class="dialog-fact">
          <span class="dialog-fact-label">Responsable</span>
          <span class="dialog-fact-value">${avatar(ownerId, 'avatar--md')}<span>${esc(ownerName)}<small>${esc(ownerRole)}</small></span>${support.length ? `<span class="dialog-support"><i class="fa-solid fa-user-plus" aria-hidden="true"></i>Con apoyo de ${esc(supportNames)}</span>` : ''}</span>
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">${systemsLabel}</span>
          ${systems}
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">Tiempo estimado</span>
          <span class="dialog-fact-value"><i class="fa-regular fa-clock" style="color:#9A6500;font-size:8px" aria-hidden="true"></i>${esc(step.time)}</span>
        </div>
        <div class="dialog-fact">
          <span class="dialog-fact-label">Tipo de paso</span>
          <span class="dialog-fact-value">${typeLabel}</span>
        </div>
      </div>
      ${io}
      ${decisionCallout}
      ${linkCallout}
      ${noticeCallout}
      <div class="dialog-actions">
        <span class="dialog-hint">Flujo ${pad2(flow.n)} · ${esc(flow.fullName)}</span>
        ${cta}
      </div>
    </div>`;

  const dialog = $('#stepDialog');
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => {
    const card = $('.dialog-card', dialog);
    if (card) card.scrollTop = 0;
  });
  document.body.classList.add('is-locked');
}

function closeDialog() {
  const dialog = $('#stepDialog');
  document.body.classList.remove('is-locked');
  if (dialog.open) dialog.close();
}

/* ============================================================
   INTERACCIÓN · Filtros
   ============================================================ */
function closeDropdown(dd, restoreFocus) {
  if (!dd) return;
  const trigger = $('.filter-trigger', dd);
  const menu = $('.filter-menu', dd);
  if (!trigger || !menu) return;
  dd.classList.remove('is-open');
  trigger.setAttribute('aria-expanded', 'false');
  menu.hidden = true;
  if (restoreFocus) trigger.focus();
}

function closeAllDropdowns() {
  $$('.filter-dropdown.is-open').forEach(dd => closeDropdown(dd, false));
}

function openDropdown(dd) {
  closeAllDropdowns();
  const trigger = $('.filter-trigger', dd);
  const menu = $('.filter-menu', dd);
  dd.classList.add('is-open');
  trigger.setAttribute('aria-expanded', 'true');
  menu.hidden = false;
}

function toggleSet(set, value) {
  if (set.has(value)) set.delete(value);
  else set.add(value);
}

function setupFilterEvents() {
  $$('.filter-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const dd = trigger.closest('.filter-dropdown');
      if (dd.classList.contains('is-open')) {
        closeDropdown(dd, false);
        return;
      }
      openDropdown(dd);
      if (event.detail === 0) {
        const selected = $('.filter-option[aria-selected="true"]', dd);
        if (selected) setTimeout(() => selected.focus(), 0);
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = $('.filter-dropdown.is-open');
    if (open) {
      event.preventDefault();
      closeDropdown(open, true);
    }
  });

  $$('.filter-menu').forEach(menu => {
    menu.addEventListener('keydown', event => {
      const options = $$('.filter-option', menu);
      if (!options.length) return;
      const current = options.indexOf(document.activeElement);
      let next = -1;
      if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % options.length;
      else if (event.key === 'ArrowUp') next = current <= 0 ? options.length - 1 : current - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      if (next >= 0 && next < options.length) {
        event.preventDefault();
        options[next].focus();
      }
    });
  });

  // Un único listener delegado para filtros, menús y chips.
  document.addEventListener('click', event => {
    if (!event.target.closest('.filter-dropdown')) closeAllDropdowns();

    const option = event.target.closest('.filter-option');
    if (option) {
      const group = option.dataset.filter;
      const value = option.dataset.value;
      if (group === 'process') {
        state.process = value;
        applyFilters();
        closeAllDropdowns();
        $('#trigger-process').focus();
        return;
      }
      if (group === 'people') {
        if (value === 'all') state.people.clear();
        else toggleSet(state.people, value);
      }
      if (group === 'systems') {
        if (value === 'all') state.systems.clear();
        else toggleSet(state.systems, value);
      }
      applyFilters();
      return;
    }

    const clearGroup = event.target.closest('[data-clear-group]');
    if (clearGroup) {
      const group = clearGroup.dataset.clearGroup;
      if (group === 'process') state.process = 'all';
      if (group === 'people') state.people.clear();
      if (group === 'systems') state.systems.clear();
      applyFilters();
      const dd = clearGroup.closest('.filter-dropdown');
      if (dd) closeDropdown(dd, true);
      return;
    }

    const chip = event.target.closest('[data-chip-type]');
    if (chip) {
      const type = chip.dataset.chipType;
      const value = chip.dataset.chipValue;
      if (type === 'process') state.process = 'all';
      if (type === 'people') state.people.delete(value);
      if (type === 'systems') state.systems.delete(value);
      applyFilters();
    }
  });

  $('#resetFilters').addEventListener('click', () => {
    clearFilters();
    $('#resultsNote').focus({ preventScroll: true });
  });
  $('#emptyReset').addEventListener('click', () => {
    clearFilters();
    $('#resultsNote').focus({ preventScroll: true });
  });
}

/* ============================================================
   INTERACCIÓN · Flujos, modal, equipo y navegación
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function openFlowAndScroll(n) {
  const target = document.getElementById(`flujo-${n}`);
  if (!target) return;
  if (target.hidden) clearFilters();
  target.open = true;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    setActiveFlow(n);
  });
}

function setActiveFlow(n) {
  $$('#flowIndexList .index-link').forEach(link => {
    const active = link.dataset.flowLink === String(n);
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}

function focusAfterScroll(node) {
  if (!node) return;
  const focus = () => node.focus({ preventScroll: true });
  if ('onscrollend' in window) {
    window.addEventListener('scrollend', focus, { once: true });
  } else {
    requestAnimationFrame(() => requestAnimationFrame(focus));
  }
}

function setupFlowEvents() {
  $('#flowsList').addEventListener('click', event => {
    const step = event.target.closest('[data-step-id]');
    if (step) {
      event.preventDefault();
      openStep(step.dataset.stepId, step.dataset.owner, step.dataset.n);
    }
  });

  // Listener separado del de filtros: gestiona navegación, modal y anclas del mapa.
  document.addEventListener('click', event => {
    const goto = event.target.closest('[data-goto-flow]');
    if (goto) {
      event.preventDefault();
      closeDialog();
      openFlowAndScroll(goto.dataset.gotoFlow);
      return;
    }

    const closeButton = event.target.closest('[data-close-dialog]');
    if (closeButton) {
      event.preventDefault();
      closeDialog();
      return;
    }

    const anchor = event.target.closest('a[href^="#flujo-"]');
    if (anchor) {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target && target.tagName === 'DETAILS') {
        if (target.hidden) clearFilters();
        target.open = true;
        setActiveFlow(target.dataset.flow);
      }
    }
  });

  $('#teamGrid').addEventListener('click', event => {
    const card = event.target.closest('[data-person-filter]');
    if (!card) return;
    const id = card.dataset.personFilter;
    state.process = 'all';
    state.people = new Set([id]);
    state.systems.clear();
    applyFilters();
    closeAllDropdowns();
    document.getElementById('flujos').scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    });
    focusAfterScroll($('#resultsNote'));
  });

  $('#expandAll').addEventListener('click', () => {
    $$('#flowsList .flow-card:not([hidden])').forEach(card => { card.open = true; });
  });
  $('#collapseAll').addEventListener('click', () => {
    $$('#flowsList .flow-card:not([hidden])').forEach(card => { card.open = false; });
  });

  $$('.flow-card').forEach(card => {
    card.addEventListener('toggle', () => {
      if (card.open) setActiveFlow(card.dataset.flow);
    });
  });
}

function setupDialog() {
  const dialog = $('#stepDialog');
  const closeButton = $('#dialogClose');
  $('#systemsDialogTrigger').addEventListener('click', event => {
    event.preventDefault();
    lastDialogTrigger = event.currentTarget;
    const content = $('#systemsDialogContent').content.cloneNode(true);
    content.querySelectorAll('[data-access-avatar]').forEach(slot => {
      slot.outerHTML = avatar(slot.dataset.accessAvatar, 'avatar--md');
    });
    content.querySelectorAll('[data-dialog-system]').forEach(slot => {
      slot.outerHTML = sysIcon(slot.dataset.dialogSystem, false);
    });
    $('#dialogContent').replaceChildren(content);
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => {
      const card = $('.dialog-card', dialog);
      if (card) card.scrollTop = 0;
    });
    document.body.classList.add('is-locked');
  });
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('cancel', () => {
    document.body.classList.remove('is-locked');
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (lastDialogTrigger && document.contains(lastDialogTrigger)) {
      lastDialogTrigger.focus({ preventScroll: true });
    }
    lastDialogTrigger = null;
  });
}

function setupObserver() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.hidden) {
        setActiveFlow(entry.target.dataset.flow);
      }
    });
  }, { rootMargin: '-100px 0px -66% 0px', threshold: 0 });
  $$('#flowsList .flow-card').forEach(card => observer.observe(card));
}

function setupTrackNav() {
  const syncShell = shell => {
    const track = $('.flow-track', shell);
    const prev = $('[data-track-prev]', shell);
    const next = $('[data-track-next]', shell);
    if (!track || !prev || !next) return;
    const max = track.scrollWidth - track.clientWidth;
    const scrollable = max > 4;
    const atStart = track.scrollLeft <= 2;
    const atEnd = track.scrollLeft >= max - 2;
    shell.classList.toggle('is-start', !scrollable || atStart);
    shell.classList.toggle('is-end', !scrollable || atEnd);
    prev.disabled = !scrollable || atStart;
    next.disabled = !scrollable || atEnd;
  };

  $$('[data-track-shell]').forEach(shell => {
    const track = $('.flow-track', shell);
    const prev = $('[data-track-prev]', shell);
    const next = $('[data-track-next]', shell);
    if (!track || !prev || !next) return;
    const page = () => Math.max(track.clientWidth * 0.8, 160);
    const behavior = prefersReducedMotion ? 'auto' : 'smooth';
    prev.addEventListener('click', () => track.scrollBy({ left: -page(), behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: page(), behavior }));
    track.addEventListener('scroll', () => syncShell(shell), { passive: true });
    window.addEventListener('resize', () => syncShell(shell));
    syncShell(shell);
  });
}

function setupChrome() {
  const printButtons = ['printBtn', 'printBtn2', 'printBtn3'];
  printButtons.forEach(id => {
    const button = document.getElementById(id);
    if (button) button.addEventListener('click', () => window.print());
  });

  let openState = [];
  window.addEventListener('beforeprint', () => {
    openState = $$('#flowsList .flow-card').map(card => card.open);
    $$('#flowsList .flow-card').forEach(card => { card.open = true; });
  });
  window.addEventListener('afterprint', () => {
    $$('#flowsList .flow-card').forEach((card, index) => {
      card.open = Boolean(openState[index]);
    });
  });

  const backTop = $('#backTop');
  const onScroll = () => backTop.classList.toggle('is-visible', window.scrollY > 620);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
  $('#backTopFooter').addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

  // Los enlaces del índice los gestiona el listener delegado de setupFlowEvents().
  if (location.hash && location.hash.startsWith('#flujo-')) {
    const target = document.querySelector(location.hash);
    if (target && target.tagName === 'DETAILS') {
      target.open = true;
      setTimeout(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }), 160);
    }
  }
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
function init() {
  renderProcessMenu();
  renderPeopleMenu();
  renderSystemsMenu();
  renderKpiAvatars();
  renderIndex();
  renderHeadCounts();
  renderFooterSystems();
  $('#flowsList').innerHTML = FLOWS.map(renderFlow).join('');
  renderTeam();

  setupFilterEvents();
  setupFlowEvents();
  setupDialog();
  setupTrackNav();
  setupChrome();

  applyFilters();
  setActiveFlow(1);
  setupObserver();
}

init();
