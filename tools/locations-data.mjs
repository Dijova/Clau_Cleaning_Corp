// Service-area cities, clients and gallery items, used by tools/build-pages.mjs
// (city pages, Our Clients, Gallery), tools/build-services.mjs and the sitemap.
// Edit here, then run:  npm run build

// ---------------------------------------------------------------------------
// Cities. Coordinates are approximate town centers, used only to sort nearby
// towns and to state the rough distance from our Dracut base.
// `note` is one local sentence per city so every page says something specific.
// ---------------------------------------------------------------------------
export const HQ = { name: 'Dracut', state: 'MA', lat: 42.670, lng: -71.302 };

export const CITY_LIST = [
    // Massachusetts
    { name: 'Dracut', state: 'MA', county: 'Middlesex', lat: 42.670, lng: -71.302,
        en: 'Dracut is home: our office is at 1734 Lakeview Ave, so local businesses get the fastest response we can give.',
        es: 'Dracut es nuestra casa: la oficina está en 1734 Lakeview Ave, así que los negocios locales reciben la respuesta más rápida.' },
    { name: 'Lowell', state: 'MA', county: 'Middlesex', lat: 42.633, lng: -71.316,
        en: 'From downtown medical offices to the converted mill buildings along the canals, Lowell has some of the busiest facilities in the Merrimack Valley.',
        es: 'Desde los consultorios del centro hasta los antiguos edificios de fábricas junto a los canales, Lowell tiene algunas de las instalaciones más concurridas del Merrimack Valley.' },
    { name: 'Lawrence', state: 'MA', county: 'Essex', lat: 42.707, lng: -71.163,
        en: 'Lawrence clinics and offices see heavy daily traffic, and our bilingual crew talks with staff and managers in English or Spanish.',
        es: 'Las clínicas y oficinas de Lawrence reciben mucho tráfico diario, y nuestro equipo bilingüe habla con el personal en inglés o en español.' },
    { name: 'Methuen', state: 'MA', county: 'Essex', lat: 42.726, lng: -71.191,
        en: 'Methuen sits where I-93 meets I-495, with medical buildings, retail and offices that need reliable after-hours cleaning.',
        es: 'Methuen está donde se cruzan la I-93 y la I-495, con edificios médicos, comercios y oficinas que necesitan limpieza confiable fuera de horario.' },
    { name: 'Andover', state: 'MA', county: 'Essex', lat: 42.658, lng: -71.137,
        en: 'Andover is known for its corporate campuses along I-93 and I-495, plus a strong base of private medical practices.',
        es: 'Andover es conocido por sus campus corporativos junto a la I-93 y la I-495, y por muchos consultorios médicos privados.' },
    { name: 'North Andover', state: 'MA', county: 'Essex', lat: 42.699, lng: -71.135,
        en: 'North Andover combines medical offices, professional buildings and schools that expect a spotless, healthy space every morning.',
        es: 'North Andover combina consultorios, edificios profesionales y escuelas que esperan un espacio impecable y saludable cada mañana.' },
    { name: 'Haverhill', state: 'MA', county: 'Essex', lat: 42.776, lng: -71.077,
        en: 'Haverhill has a growing downtown and healthcare sector, from rehab and outpatient centers to busy professional offices.',
        es: 'Haverhill tiene un centro en crecimiento y un sector de salud activo, desde centros de rehabilitación hasta oficinas profesionales.' },
    { name: 'Newburyport', state: 'MA', county: 'Essex', lat: 42.812, lng: -70.877,
        en: 'In historic Newburyport, older buildings and original floors need careful cleaning and the right floor-care methods.',
        es: 'En el histórico Newburyport, los edificios antiguos y sus pisos originales necesitan una limpieza cuidadosa y el método correcto.' },
    { name: 'Billerica', state: 'MA', county: 'Middlesex', lat: 42.558, lng: -71.269,
        en: 'Billerica is part of the Route 3 technology corridor, with labs, offices and medical sites that need consistent cleaning.',
        es: 'Billerica es parte del corredor tecnológico de la Ruta 3, con laboratorios, oficinas y centros médicos que necesitan limpieza constante.' },
    { name: 'Tewksbury', state: 'MA', county: 'Middlesex', lat: 42.611, lng: -71.234,
        en: 'Tewksbury business parks along I-495 and Route 38 are minutes from our Dracut base, so our crews are close by.',
        es: 'Los parques empresariales de Tewksbury junto a la I-495 y la Ruta 38 están a minutos de nuestra base en Dracut.' },
    { name: 'Chelmsford', state: 'MA', county: 'Middlesex', lat: 42.600, lng: -71.367,
        en: 'At the junction of Route 3 and I-495, Chelmsford has office parks, clinics and tech companies with high standards.',
        es: 'En el cruce de la Ruta 3 y la I-495, Chelmsford tiene parques de oficinas, clínicas y empresas de tecnología con altos estándares.' },
    { name: 'Tyngsborough', state: 'MA', county: 'Middlesex', lat: 42.677, lng: -71.424, alt: 'Tyngsboro',
        en: 'Tyngsborough (Tyngsboro) sits on Route 3 right on the New Hampshire line, a short drive from our Dracut office.',
        es: 'Tyngsborough (Tyngsboro) está sobre la Ruta 3, justo en el límite con New Hampshire, a pocos minutos de nuestra oficina en Dracut.' },
    { name: 'Wilmington', state: 'MA', county: 'Middlesex', lat: 42.546, lng: -71.174,
        en: 'Wilmington offices, labs and light-industrial buildings along I-93 need cleaning that works around every shift.',
        es: 'Las oficinas, laboratorios y edificios industriales de Wilmington junto a la I-93 necesitan limpieza que se adapte a cada turno.' },
    { name: 'Woburn', state: 'MA', county: 'Middlesex', lat: 42.479, lng: -71.152,
        en: 'Woburn, where I-93 meets Route 128, is full of medical, lab and corporate space where hygiene is part of the job.',
        es: 'Woburn, donde la I-93 se cruza con la Ruta 128, está lleno de espacios médicos, laboratorios y oficinas corporativas donde la higiene es parte del trabajo.' },
    { name: 'Burlington', state: 'MA', county: 'Middlesex', lat: 42.505, lng: -71.196,
        en: 'Burlington is one of the biggest office and medical hubs on Route 128, with buildings that expect a premium clean.',
        es: 'Burlington es uno de los mayores centros de oficinas y servicios médicos de la Ruta 128, con edificios que esperan una limpieza de primera.' },
    // New Hampshire
    { name: 'Hudson', state: 'NH', county: 'Hillsborough', lat: 42.765, lng: -71.440,
        en: 'Hudson businesses along Route 102 and Route 3A are just across the state line from our Dracut base.',
        es: 'Los negocios de Hudson sobre la Ruta 102 y la Ruta 3A están justo al otro lado del límite estatal desde nuestra base en Dracut.' },
    { name: 'Nashua', state: 'NH', county: 'Hillsborough', lat: 42.765, lng: -71.468,
        en: 'Nashua is New Hampshire\'s second-largest city, and we already clean schools and churches here every week.',
        es: 'Nashua es la segunda ciudad más grande de New Hampshire, y ya limpiamos escuelas e iglesias aquí cada semana.' },
    { name: 'Derry', state: 'NH', county: 'Rockingham', lat: 42.881, lng: -71.327,
        en: 'In Derry we care for healthcare and community facilities where staff and visitors need a safe, clean space.',
        es: 'En Derry cuidamos instalaciones de salud y comunitarias donde el personal y los visitantes necesitan un espacio limpio y seguro.' },
    { name: 'Londonderry', state: 'NH', county: 'Rockingham', lat: 42.865, lng: -71.374,
        en: 'Londonderry\'s business parks near I-93 and the Manchester-Boston Regional Airport are part of our regular routes.',
        es: 'Los parques empresariales de Londonderry cerca de la I-93 y del aeropuerto Manchester-Boston son parte de nuestras rutas.' },
    { name: 'Salem', state: 'NH', county: 'Rockingham', lat: 42.788, lng: -71.201,
        en: 'Salem is our busiest New Hampshire town, with surgical, imaging, eye-care and rehab clients along the Route 28 corridor.',
        es: 'Salem es nuestra ciudad con más trabajo en New Hampshire, con clientes de cirugía, imágenes, oftalmología y rehabilitación en la Ruta 28.' },
    { name: 'Manchester', state: 'NH', county: 'Hillsborough', lat: 42.996, lng: -71.455,
        en: 'Manchester is New Hampshire\'s largest city, from Millyard offices to medical buildings and service centers.',
        es: 'Manchester es la ciudad más grande de New Hampshire, desde las oficinas del Millyard hasta edificios médicos y centros de servicio.' },
    { name: 'Bedford', state: 'NH', county: 'Hillsborough', lat: 42.946, lng: -71.516,
        en: 'Bedford\'s professional offices along Route 101 include organizations we have cleaned for years.',
        es: 'Las oficinas profesionales de Bedford sobre la Ruta 101 incluyen organizaciones que limpiamos desde hace años.' },
    { name: 'Pelham', state: 'NH', county: 'Hillsborough', lat: 42.735, lng: -71.325,
        en: 'Pelham borders Dracut, so our crews can be there quickly for regular service or a same-week deep clean.',
        es: 'Pelham limita con Dracut, así que nuestros equipos llegan rápido para el servicio regular o una limpieza profunda en la misma semana.' },
    { name: 'Hollis', state: 'NH', county: 'Hillsborough', lat: 42.743, lng: -71.592,
        en: 'Hollis offices, schools and community buildings get the same care and the same crew every visit.',
        es: 'Las oficinas, escuelas y edificios comunitarios de Hollis reciben el mismo cuidado y el mismo equipo en cada visita.' },
    { name: 'Amherst', state: 'NH', county: 'Hillsborough', lat: 42.861, lng: -71.625,
        en: 'Amherst businesses along Route 101A count on a cleaning partner that shows up on schedule, every time.',
        es: 'Los negocios de Amherst sobre la Ruta 101A cuentan con un equipo de limpieza que llega a tiempo, siempre.' },
    { name: 'Merrimack', state: 'NH', county: 'Hillsborough', lat: 42.865, lng: -71.493,
        en: 'Merrimack\'s office parks and manufacturers along the Everett Turnpike need cleaning that fits around every shift.',
        es: 'Los parques de oficinas y fábricas de Merrimack junto a la Everett Turnpike necesitan limpieza que se adapte a cada turno.' }
];

export const STATE_NAME = { MA: 'Massachusetts', NH: 'New Hampshire' };
export const citySlug = (c) => `${c.name.toLowerCase().replace(/\s+/g, '-')}-${c.state.toLowerCase()}`;

// ---------------------------------------------------------------------------
// Clients (approved for the "Trusted by" posts). Drop each logo in
// assets/img/clients/<slug>.(svg|png|webp|jpg) and the build picks it up.
// `cities` must match CITY_LIST names to show on that city page; `extra` lists
// other locations we serve that are outside the main list.
// ---------------------------------------------------------------------------
export const CLIENT_GROUPS = [
    { key: 'health', en: 'Health & Care', es: 'Salud y Cuidado', tagEn: 'where patients are cared for', tagEs: 'donde se cuida a los pacientes' },
    { key: 'education', en: 'Education & Faith', es: 'Educación y Fe', tagEn: 'where students learn and families gather', tagEs: 'donde los estudiantes aprenden y las familias se reúnen' },
    { key: 'business', en: 'Organizations & Business', es: 'Organizaciones y Empresas', tagEn: 'where teams get to work', tagEs: 'donde los equipos trabajan' }
];

export const CLIENTS = [
    { slug: 'northeast-rehabilitation-hospital-network', name: 'Northeast Rehabilitation Hospital Network', group: 'health',
        typeEn: 'Rehabilitation hospital & outpatient clinics', typeEs: 'Hospital de rehabilitación y clínicas ambulatorias',
        cities: ['Lowell, MA', 'Lawrence, MA', 'Methuen, MA', 'Billerica, MA', 'Andover, MA', 'North Andover, MA', 'Haverhill, MA', 'Newburyport, MA', 'Tewksbury, MA', 'Chelmsford, MA', 'Salem, NH'],
        extra: ['Plaistow, NH', 'Windham, NH'] },
    { slug: 'tallman-eye-associates', name: 'Tallman Eye Associates', group: 'health',
        typeEn: 'Eye care & ophthalmology offices', typeEs: 'Consultorios de oftalmología',
        cities: ['Lawrence, MA', 'North Andover, MA', 'Newburyport, MA', 'Salem, NH'] },
    { slug: 'orchard-surgical-center', name: 'Orchard Surgical Center', group: 'health',
        typeEn: 'Ambulatory surgical center', typeEs: 'Centro quirúrgico ambulatorio',
        cities: ['Salem, NH'] },
    { slug: 'orchard-imaging', name: 'Orchard Imaging', group: 'health',
        typeEn: 'Medical imaging center', typeEs: 'Centro de imágenes médicas',
        cities: ['Salem, NH'] },
    { slug: 'center-for-life-management', name: 'Center for Life Management', group: 'health',
        typeEn: 'Behavioral health center', typeEs: 'Centro de salud mental',
        cities: ['Derry, NH', 'Salem, NH'] },
    { slug: 'saint-christopher-academy', name: 'Saint Christopher Academy', group: 'education',
        typeEn: 'Private school', typeEs: 'Escuela privada',
        cities: ['Nashua, NH'] },
    { slug: 'saint-christopher-catholic-church', name: 'Saint Christopher Catholic Church', group: 'education',
        typeEn: 'Church & parish buildings', typeEs: 'Iglesia y edificios parroquiales',
        cities: ['Nashua, NH'] },
    { slug: 'nh-housing', name: 'NH Housing', group: 'business',
        typeEn: 'Offices', typeEs: 'Oficinas',
        cities: ['Bedford, NH'] },
    { slug: 'holden-engineering-surveying', name: 'Holden Engineering & Surveying', group: 'business',
        typeEn: 'Professional offices', typeEs: 'Oficinas profesionales',
        cities: ['Bedford, NH'] },
    { slug: 'amerigas', name: 'AmeriGas', group: 'business',
        typeEn: 'Offices & service center', typeEs: 'Oficinas y centro de servicio',
        cities: ['Londonderry, NH'] },
    { slug: 'aaa-northeast', name: 'AAA Northeast', group: 'business',
        typeEn: 'Branch offices', typeEs: 'Sucursales',
        cities: ['Manchester, NH', 'Nashua, NH'] }
];

// ---------------------------------------------------------------------------
// Gallery. type: 'image' | 'video' | 'before-after'.
// Put your own files in assets/img/gallery/ (photos, ~1600px wide JPG/WebP) and
// assets/video/ (MP4, H.264, under ~15 MB) and use paths like 'assets/img/gallery/x.jpg'.
// cat: medical | facilities | floors | carpets | before-after | video
// ---------------------------------------------------------------------------

export const GALLERY_CATS = [
    { key: 'medical', en: 'Medical & labs', es: 'Médico y laboratorios' },
    { key: 'facilities', en: 'Offices & facilities', es: 'Oficinas e instalaciones' },
    { key: 'floors', en: 'Floor care', es: 'Cuidado de pisos' },
    { key: 'carpets', en: 'Carpet cleaning', es: 'Limpieza de alfombras' },
    { key: 'before-after', en: 'Before & after', es: 'Antes y después' },
    { key: 'video', en: 'Videos', es: 'Videos' }
];

// Our own work: strip & wax and deep cleaning of an outpatient physical therapy clinic.
const g = (name) => `assets/img/gallery/${name}.webp`;
const v = (name) => `assets/video/${name}.mp4`;

export const GALLERY = [
    { type: 'before-after', cat: 'before-after', before: g('lab-before'), after: g('lab-after'), w: 720, h: 1280,
        en: 'Clinical lab floor before and after strip and wax', es: 'Piso de laboratorio clínico antes y después del decapado y encerado' },
    { type: 'image', cat: 'medical', tall: true, src: g('patient-area-clean'), w: 720, h: 960,
        en: 'Clean patient treatment area in a rehab hospital', es: 'Área de tratamiento de pacientes limpia en un hospital de rehabilitación' },
    { type: 'image', cat: 'carpets', tall: true, src: g('carpet-hallway-machines'), w: 720, h: 960,
        en: 'Commercial carpet cleaning in a clinic hallway', es: 'Limpieza de alfombra comercial en un pasillo de clínica' },
    { type: 'before-after', cat: 'before-after', before: g('clinic-hallway-before'), after: g('clinic-hallway-after'), w: 720, h: 1280,
        en: 'Clinic hallway floor before and after refinishing', es: 'Piso de pasillo de clínica antes y después del acabado' },
    { type: 'image', cat: 'facilities', tall: true, src: g('office-workspace-clean'), w: 720, h: 960,
        en: 'Clean, polished open office workspace', es: 'Área de oficina abierta limpia y con piso pulido' },
    { type: 'before-after', cat: 'before-after', before: g('equipment-room-before'), after: g('equipment-room-after'), w: 720, h: 1280,
        en: 'Equipment room floor before and after strip and wax', es: 'Piso de sala de equipos antes y después del decapado y encerado' },
    { type: 'image', cat: 'floors', tall: true, src: g('rehab-gym-floor-shine'), w: 720, h: 960,
        en: 'High-gloss floor in a rehab therapy gym', es: 'Piso de alto brillo en un gimnasio de terapia' },
    { type: 'before-after', cat: 'before-after', before: g('utility-room-before'), after: g('utility-room-after'), w: 720, h: 1280,
        en: 'Utility room floor before and after scrubbing and waxing', es: 'Piso de cuarto de servicio antes y después del fregado y encerado' },
    { type: 'image', cat: 'floors', tall: true, src: g('corridor-tile-shine'), w: 720, h: 960,
        en: 'Polished tile corridor in a medical building', es: 'Pasillo de baldosa pulida en un edificio médico' },
    { type: 'before-after', cat: 'before-after', before: g('hallway-before'), after: g('hallway-after'), w: 720, h: 1280,
        en: 'Clinic hallway before and after floor stripping and waxing', es: 'Pasillo de clínica antes y después del decapado y encerado del piso' },
    { type: 'video', cat: 'video', src: v('floor-stripping'), poster: g('floor-stripping'), w: 720, h: 1280,
        en: 'Floor stripping with a rotary floor machine', es: 'Decapado de piso con máquina rotativa' },
    { type: 'image', cat: 'floors', tall: true, src: g('corridor-polished'), w: 720, h: 1280,
        en: 'Polished vinyl tile corridor after the wax coats', es: 'Pasillo de vinil pulido después de las capas de cera' },
    { type: 'before-after', cat: 'before-after', before: g('therapy-room-before'), after: g('therapy-room-after'), w: 720, h: 1280,
        en: 'Physical therapy gym before and after floor care', es: 'Gimnasio de fisioterapia antes y después del cuidado del piso' },
    { type: 'image', cat: 'medical', tall: true, src: g('exam-room-clean'), w: 720, h: 1280,
        en: 'Clean, disinfected treatment room', es: 'Sala de tratamiento limpia y desinfectada' },
    { type: 'video', cat: 'video', src: v('floor-waxing'), poster: g('floor-waxing'), w: 720, h: 1280,
        en: 'Applying floor finish coats', es: 'Aplicación de las capas de acabado del piso' },
    { type: 'image', cat: 'floors', tall: true, src: g('floor-scrubbing'), w: 720, h: 1280,
        en: 'Scrubbing old wax off a vinyl floor', es: 'Removiendo la cera vieja de un piso de vinil' },
    { type: 'before-after', cat: 'before-after', before: g('gym-before'), after: g('gym-after'), w: 720, h: 1280,
        en: 'Clinic floor before and after stripping and waxing', es: 'Piso de clínica antes y después del decapado y encerado' },
    { type: 'image', cat: 'medical', tall: true, src: g('clinic-floor-polished'), w: 720, h: 1280,
        en: 'Rehab clinic floor with a fresh high-gloss finish', es: 'Piso de clínica de rehabilitación con brillo nuevo' },
    { type: 'video', cat: 'video', src: v('floor-result-walkthrough'), poster: g('floor-result-walkthrough'), w: 720, h: 1280,
        en: 'Walkthrough of the finished floors', es: 'Recorrido por los pisos terminados' },
    { type: 'before-after', cat: 'before-after', before: g('equipment-area-before'), after: g('equipment-area-after'), w: 720, h: 1280,
        en: 'Exercise equipment area before and after', es: 'Área de equipos de ejercicio antes y después' },
    { type: 'image', cat: 'facilities', tall: true, src: g('waiting-room-polished'), w: 720, h: 1280,
        en: 'Waiting room with clean, polished floors', es: 'Sala de espera con pisos limpios y pulidos' },
    { type: 'before-after', cat: 'before-after', before: g('office-before'), after: g('office-after'), w: 720, h: 1280,
        en: 'Staff office before and after cleaning', es: 'Oficina del personal antes y después de la limpieza' },
    { type: 'image', cat: 'medical', tall: true, src: g('exam-room-2-clean'), w: 720, h: 1280,
        en: 'Exam room ready for the next patient', es: 'Consultorio listo para el siguiente paciente' },
    { type: 'video', cat: 'video', src: v('floor-drying'), poster: g('floor-drying'), w: 720, h: 1280,
        en: 'Air movers drying the floor between coats', es: 'Ventiladores secando el piso entre capas' },
    { type: 'image', cat: 'floors', tall: true, src: g('hallway-polished'), w: 720, h: 1280,
        en: 'Long hallway with a glossy floor finish', es: 'Pasillo largo con acabado brillante' },
    { type: 'before-after', cat: 'before-after', before: g('exam-room-before'), after: g('exam-room-after'), w: 720, h: 1280,
        en: 'Treatment room before and after', es: 'Sala de tratamiento antes y después' },
    { type: 'image', cat: 'facilities', tall: true, src: g('treatment-area-polished'), w: 720, h: 1280,
        en: 'Open treatment area after floor care', es: 'Área de tratamiento abierta después del cuidado de pisos' },
    { type: 'video', cat: 'video', src: v('floor-finish-coat'), poster: g('floor-finish-coat'), w: 720, h: 1280,
        en: 'Finishing a clinic floor', es: 'Terminando el piso de una clínica' },
    { type: 'image', cat: 'floors', tall: true, src: g('clinic-floor-shine'), w: 720, h: 1280,
        en: 'Clinic floor shine after the final coat', es: 'Brillo del piso de la clínica después de la última capa' }
];
