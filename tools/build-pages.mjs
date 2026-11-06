// Generates the Gallery, Our Clients and Service Areas pages, one page per city,
// redirect pages for retired URLs and sitemap.xml, in English and Spanish.
// Data: tools/locations-data.mjs and tools/services-data.mjs.  Run:  npm run build
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, SERVICES, REDIRECTS } from './services-data.mjs';
import { HQ, CITY_LIST, STATE_NAME, citySlug, CLIENTS, CLIENT_GROUPS, GALLERY, GALLERY_CATS } from './locations-data.mjs';
import { layout, esc, svg, ICON, abs, BUSINESS_ID, breadcrumbs, faqPage, NAV } from './layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['en', 'es'];

function write(lang, path, html) {
    const dir = join(root, lang === 'es' ? 'es' : '', path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
}

// ---------- helpers ----------
const miles = (a, b) => {
    const r = (d) => (d * Math.PI) / 180;
    const dLat = r(b.lat - a.lat), dLng = r(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 3958.8 * 2 * Math.asin(Math.sqrt(h));
};
const label = (c) => `${c.name}, ${c.state}`;
const cityByLabel = Object.fromEntries(CITY_LIST.map((c) => [label(c), c]));
const clientsIn = (c) => CLIENTS.filter((x) => x.cities.includes(label(c)));
const nearestCities = (c, n) => CITY_LIST.filter((x) => x !== c).sort((a, b) => miles(c, a) - miles(c, b)).slice(0, n);
const hqMiles = (c) => Math.max(1, Math.round(miles(HQ, c)));
const list = (lang, items) => {
    if (items.length <= 1) return items.join('');
    const and = lang === 'es' ? ' y ' : ' and ';
    return items.slice(0, -1).join(', ') + and + items[items.length - 1];
};

// Client logo: uses assets/img/clients/<slug>.<ext> when the file exists, otherwise a text mark.
const LOGO_EXT = ['svg', 'png', 'webp', 'jpg', 'jpeg'];
function logoFile(slug) {
    for (const ext of LOGO_EXT) if (existsSync(join(root, 'assets/img/clients', `${slug}.${ext}`))) return `assets/img/clients/${slug}.${ext}`;
    return null;
}
const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 4);
function logo(client, rootRel) {
    const f = logoFile(client.slug);
    return f
        ? `<img src="${rootRel}${f}" alt="${esc(client.name)} logo" loading="lazy" width="200" height="80">`
        : `<span class="client-mark" aria-hidden="true">${esc(initials(client.name))}</span>`;
}

// ---------- copy ----------
const T = {
    en: {
        home: 'Home',
        quote: 'Request a Free Quote',
        whatsapp: 'WhatsApp',
        bandTitle: 'Ready for a cleaner, healthier facility?',
        bandText: "Tell us about your building and we'll schedule a free walkthrough and send a written quote within one business day.",
        // gallery
        gTitle: 'Gallery: Commercial, Carpet & Floor Cleaning Work | Clau Cleaning Corp',
        gDesc: 'Photos and videos of our commercial cleaning, medical facility cleaning, carpet cleaning and floor care work in Northern Massachusetts and Southern New Hampshire.',
        gH1: 'Our work, before and after',
        gLead: 'Medical facilities, offices, carpets and floors we clean and restore across Northern Massachusetts and Southern New Hampshire.',
        gAll: 'All', gFilter: 'Filter gallery', gMore: 'See more of our daily work on', gBefore: 'Before', gAfter: 'After',
        lbView: 'Image viewer', lbClose: 'Close', lbPrev: 'Previous', lbNext: 'Next',
        // clients
        cTitle: 'Our Clients: Medical, School, Church & Business | Clau Cleaning Corp',
        cDesc: 'Hospitals, surgical and imaging centers, eye-care practices, schools, churches and offices across MA and NH trust Clau Cleaning Corp. Some for 15+ years.',
        cH1: 'The organizations that trust us with their spaces',
        cLead: '11 organizations. 1 cleaning partner. Some have trusted us for more than 15 years, and every one of them for at least 2.',
        cStats: [['11', 'organizations'], ['15+', 'years with our longest client'], ['2+', 'years with every client'], [String(CITY_LIST.length), 'towns in MA & NH']],
        cWhere: 'Locations we clean', cAlso: 'also', cAreas: 'Find us in your town',
        cAreasText: 'See the clients we serve and the services we offer in each town:',
        // areas
        aTitle: 'Commercial Cleaning Service Areas in MA & NH | Clau Cleaning Corp',
        aDesc: `Commercial, medical facility, carpet and floor cleaning in ${CITY_LIST.length} towns of Northern Massachusetts and Southern New Hampshire, from our base in Dracut, MA.`,
        aH1: 'Commercial cleaning across Northern MA & Southern NH',
        aLead: `From our office in Dracut, MA our crews clean medical facilities, offices, car dealerships, churches and schools in ${CITY_LIST.length} towns on both sides of the state line.`,
        aCounty: 'County', aClients: (n) => (n === 1 ? '1 client' : `${n} clients`), aMiles: (m) => `${m} mi from Dracut`, aHome: 'Our home base',
        // city
        cityTitle: (c) => `Commercial Cleaning in ${label(c)} | Clau Cleaning Corp`,
        cityDesc: (c) => `Commercial cleaning in ${label(c)}: medical offices, clinics, labs, offices, car dealerships and churches, plus carpet cleaning and floor care. Local crew. Free quote.`,
        cityH1: (c) => `Commercial cleaning in ${label(c)}`,
        cityLead: (c) => c.name === HQ.name
            ? `Medical facility, office, carpet and floor cleaning for ${c.name} businesses, from our home office right here in ${c.name}.`
            : `Medical facility, office, carpet and floor cleaning for ${c.name} businesses, from a local crew based in Dracut, MA, about ${hqMiles(c)} miles away.`,
        clientsHere: (c, n) => (n ? `Clients we serve in ${c.name}` : `Trusted by organizations near ${c.name}`),
        clientsHereText: (c, n) => (n
            ? `${n === 1 ? 'This organization counts' : `These ${n} organizations count`} on Clau Cleaning Corp in ${label(c)}:`
            : `We already clean for these organizations close to ${c.name}:`),
        allClients: 'See all our clients →',
        svcHere: (c) => `Our cleaning services in ${c.name}`,
        whyHere: (c) => `Why ${c.name} facilities choose Clau Cleaning Corp`,
        why: ['Specialists in doctor\'s offices, medical facilities and laboratories', 'Hospital-grade, EPA-registered disinfectants and color-coded microfiber', 'HEPA backpack vacuums and color-coded flat mopping system', 'Written work schedule, evening service and one point of contact', 'Bilingual crew and supervisors: English and Spanish', '20+ years cleaning in Massachusetts and New Hampshire'],
        facilitiesHere: (c) => `Facilities we clean in ${c.name}`,
        facilities: ['Doctor\'s and dental offices', 'Clinics and hospitals', 'Surgical and imaging centers', 'Medical and research laboratories', 'Professional offices', 'Car dealerships and showrooms', 'Churches and parish halls', 'Schools and daycares'],
        nearby: 'Nearby towns we serve',
        faqTitle: 'Frequently asked questions',
        faq: (c, here) => [
            [`Do you offer commercial cleaning in ${label(c)}?`, `Yes. Clau Cleaning Corp cleans medical offices, clinics, laboratories, offices, car dealerships, churches and schools in ${c.name} and across ${c.county} County, ${STATE_NAME[c.state]}. ${c.name === HQ.name ? 'Our office is right here in Dracut.' : `Our crew is based in Dracut, MA, about ${hqMiles(c)} miles away.`}`],
            [`Do you clean medical offices and clinics in ${c.name}?`, `Yes. Medical facilities are our specialty. We follow healthcare protocols with color-coded microfiber and hospital-grade, EPA-registered disinfectants.${here.length ? ` In ${c.name} we already clean for ${list('en', here.map((x) => x.name))}.` : ''}`],
            [`Do you offer carpet cleaning and floor care in ${c.name}?`, `Yes. We do hot water extraction, encapsulation, strip and wax, scrub and recoat and burnishing for commercial buildings in ${c.name}. Carpet and floor work is quoted per square foot after a free walkthrough.`],
            [`How do I get a cleaning quote in ${c.name}?`, `Call +1 978-328-2406 or fill out our quote form. We schedule a free walkthrough of your ${c.name} facility and send a written quote within one business day.`]
        ],
        areasCrumb: 'Service Areas'
    },
    es: {
        home: 'Inicio',
        quote: 'Solicitar Cotización Gratis',
        whatsapp: 'WhatsApp',
        bandTitle: '¿Listo para una instalación más limpia y saludable?',
        bandText: 'Cuéntenos sobre su edificio: programamos una visita gratuita y le enviamos una cotización por escrito en menos de un día hábil.',
        gTitle: 'Galería: Limpieza Comercial, de Alfombras y Pisos | Clau Cleaning Corp',
        gDesc: 'Fotos y videos de nuestro trabajo de limpieza comercial, instalaciones médicas, alfombras y pisos en el norte de Massachusetts y el sur de New Hampshire.',
        gH1: 'Nuestro trabajo, antes y después',
        gLead: 'Instalaciones médicas, oficinas, alfombras y pisos que limpiamos y recuperamos en el norte de Massachusetts y el sur de New Hampshire.',
        gAll: 'Todos', gFilter: 'Filtrar galería', gMore: 'Vea más de nuestro trabajo diario en', gBefore: 'Antes', gAfter: 'Después',
        lbView: 'Visor de imágenes', lbClose: 'Cerrar', lbPrev: 'Anterior', lbNext: 'Siguiente',
        cTitle: 'Nuestros Clientes: Salud, Escuelas, Iglesias y Empresas | Clau Cleaning Corp',
        cDesc: 'Hospitales, centros quirúrgicos y de imágenes, oftalmología, escuelas, iglesias y oficinas de MA y NH confían en Clau Cleaning Corp. Algunos hace más de 15 años.',
        cH1: 'Las organizaciones que nos confían sus espacios',
        cLead: '11 organizaciones. 1 equipo de limpieza. Algunas confían en nosotros hace más de 15 años, y todas desde hace al menos 2.',
        cStats: [['11', 'organizaciones'], ['15+', 'años con nuestro cliente más antiguo'], ['2+', 'años con cada cliente'], [String(CITY_LIST.length), 'ciudades en MA y NH']],
        cWhere: 'Sedes que limpiamos', cAlso: 'también', cAreas: 'Encuéntrenos en su ciudad',
        cAreasText: 'Vea los clientes que atendemos y los servicios que ofrecemos en cada ciudad:',
        aTitle: 'Zonas de Servicio de Limpieza Comercial en MA y NH | Clau Cleaning Corp',
        aDesc: `Limpieza comercial, de instalaciones médicas, alfombras y pisos en ${CITY_LIST.length} ciudades del norte de Massachusetts y el sur de New Hampshire, desde Dracut, MA.`,
        aH1: 'Limpieza comercial en el norte de MA y el sur de NH',
        aLead: `Desde nuestra oficina en Dracut, MA, nuestros equipos limpian instalaciones médicas, oficinas, concesionarios de autos, iglesias y escuelas en ${CITY_LIST.length} ciudades a ambos lados del límite estatal.`,
        aCounty: 'Condado de', aClients: (n) => (n === 1 ? '1 cliente' : `${n} clientes`), aMiles: (m) => `a ${m} millas de Dracut`, aHome: 'Nuestra base',
        cityTitle: (c) => `Limpieza Comercial en ${label(c)} | Clau Cleaning Corp`,
        cityDesc: (c) => `Limpieza comercial en ${label(c)}: consultorios, clínicas, laboratorios, oficinas, concesionarios e iglesias, además de alfombras y pisos. Equipo local. Cotización gratis.`,
        cityH1: (c) => `Limpieza comercial en ${label(c)}`,
        cityLead: (c) => c.name === HQ.name
            ? `Limpieza de instalaciones médicas, oficinas, alfombras y pisos para los negocios de ${c.name}, desde nuestra oficina aquí mismo en ${c.name}.`
            : `Limpieza de instalaciones médicas, oficinas, alfombras y pisos para los negocios de ${c.name}, con un equipo local de Dracut, MA, a unas ${hqMiles(c)} millas.`,
        clientsHere: (c, n) => (n ? `Clientes que atendemos en ${c.name}` : `La confianza de organizaciones cerca de ${c.name}`),
        clientsHereText: (c, n) => (n
            ? `${n === 1 ? 'Esta organización confía' : `Estas ${n} organizaciones confían`} en Clau Cleaning Corp en ${label(c)}:`
            : `Ya limpiamos para estas organizaciones cerca de ${c.name}:`),
        allClients: 'Ver todos nuestros clientes →',
        svcHere: (c) => `Nuestros servicios de limpieza en ${c.name}`,
        whyHere: (c) => `Por qué las instalaciones de ${c.name} eligen Clau Cleaning Corp`,
        why: ['Especialistas en consultorios médicos, instalaciones médicas y laboratorios', 'Desinfectantes de grado hospitalario registrados por la EPA y microfibra codificada por color', 'Aspiradoras de mochila HEPA y sistema de trapeado plano por color', 'Plan de trabajo por escrito, servicio nocturno y un solo contacto', 'Equipo y supervisores bilingües: inglés y español', 'Más de 20 años limpiando en Massachusetts y New Hampshire'],
        facilitiesHere: (c) => `Instalaciones que limpiamos en ${c.name}`,
        facilities: ['Consultorios médicos y dentales', 'Clínicas y hospitales', 'Centros quirúrgicos y de imágenes', 'Laboratorios médicos y de investigación', 'Oficinas profesionales', 'Concesionarios de autos y salas de exhibición', 'Iglesias y salones parroquiales', 'Escuelas y guarderías'],
        nearby: 'Ciudades cercanas que atendemos',
        faqTitle: 'Preguntas frecuentes',
        faq: (c, here) => [
            [`¿Ofrecen limpieza comercial en ${label(c)}?`, `Sí. Clau Cleaning Corp limpia consultorios médicos, clínicas, laboratorios, oficinas, concesionarios de autos, iglesias y escuelas en ${c.name} y en todo el condado de ${c.county}, ${STATE_NAME[c.state]}. ${c.name === HQ.name ? 'Nuestra oficina está aquí mismo en Dracut.' : `Nuestro equipo tiene base en Dracut, MA, a unas ${hqMiles(c)} millas.`}`],
            [`¿Limpian consultorios y clínicas en ${c.name}?`, `Sí. Las instalaciones médicas son nuestra especialidad. Seguimos protocolos sanitarios con microfibra codificada por color y desinfectantes de grado hospitalario registrados por la EPA.${here.length ? ` En ${c.name} ya limpiamos para ${list('es', here.map((x) => x.name))}.` : ''}`],
            [`¿Ofrecen limpieza de alfombras y cuidado de pisos en ${c.name}?`, `Sí. Hacemos extracción con agua caliente, encapsulado, decapado y encerado, fregado y recubrimiento y pulido para edificios comerciales en ${c.name}. El trabajo de alfombras y pisos se cotiza por pie cuadrado después de una visita gratuita.`],
            [`¿Cómo obtengo una cotización de limpieza en ${c.name}?`, `Llame al +1 978-328-2406 o complete nuestro formulario. Programamos una visita gratuita a su instalación en ${c.name} y enviamos una cotización por escrito en menos de un día hábil.`]
        ],
        areasCrumb: 'Zonas de Servicio'
    }
};

const band = (lang, home) => `        <section class="svc-band">
            <div class="container svc-band-inner">
                <div>
                    <h2>${T[lang].bandTitle}</h2>
                    <p>${T[lang].bandText}</p>
                </div>
                <div class="svc-band-actions">
                    <a href="${home}#quote" class="btn btn-primary btn-lg">${T[lang].quote}</a>
                    <a href="https://wa.me/19783282406" class="btn btn-ghost btn-lg" target="_blank" rel="noopener noreferrer">${svg(ICON.wa)}<span>${T[lang].whatsapp}</span></a>
                </div>
            </div>
        </section>`;

const hero = (lang, home, crumbs, h1, lead, extra = '') => `        <section class="svc-hero page-hero">
            <div class="container svc-hero-content">
                <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${home}">${T[lang].home}</a>${crumbs.map(([n, h]) => ` <span aria-hidden="true">›</span> ${h ? `<a href="${h}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}`).join('')}</nav>
                <h1>${esc(h1)}</h1>
                <p class="hero-lead">${esc(lead)}</p>
                <div class="hero-actions">
                    <a href="${home}#quote" class="btn btn-primary btn-lg">${T[lang].quote}</a>
                    <a href="tel:+19783282406" class="btn btn-ghost btn-lg">${svg(ICON.phone)}<span>+1 978-328-2406</span></a>
                </div>${extra}
            </div>
        </section>`;

const clientCard = (lang, c, rootRel, home, { showCities = true, city = null } = {}) => {
    const inList = c.cities.map((l) => (cityByLabel[l]
        ? `<a href="${home}service-areas/${citySlug(cityByLabel[l])}/">${esc(l)}</a>`
        : esc(l)));
    let all = [...inList, ...(c.extra || []).map(esc)];
    // On a city page, a client with many locations shows that city plus a count.
    if (city && all.length > 3) {
        const i = c.cities.indexOf(label(city));
        const rest = all.length - (i >= 0 ? 1 : 0);
        const more = lang === 'es' ? `+${rest} sedes más en MA y NH` : `+${rest} more locations in MA & NH`;
        all = i >= 0 ? [inList[i], more] : [more];
    }
    return `<li class="client-card">
                        <div class="client-card-logo">${logo(c, rootRel)}</div>
                        <div>
                            <h3>${esc(c.name)}</h3>
                            <p class="client-type">${esc(lang === 'es' ? c.typeEs : c.typeEn)}</p>
                            ${showCities ? `<p class="client-cities">${svg(ICON.pin)}<span>${all.join(' · ')}</span></p>` : ''}
                        </div>
                    </li>`;
};

const cityLinks = (lang, home, st) => `<ul class="area-list area-links">
                        ${CITY_LIST.filter((x) => x.state === st).map((x) => `<li><a href="${home}service-areas/${citySlug(x)}/">${esc(x.name)}, ${st}</a></li>`).join('')}
                    </ul>`;

// ---------- Gallery ----------
function galleryItem(lang, g, rootRel) {
    const src = (s) => (/^https?:/.test(s) ? s : rootRel + s);
    const alt = esc(g[lang]);
    if (g.type === 'video') {
        return `<li data-cat="${g.cat}" class="tall media-video"><video controls preload="metadata" playsinline${g.poster ? ` poster="${src(g.poster)}"` : ''} width="${g.w}" height="${g.h}" aria-label="${alt}"><source src="${src(g.src)}" type="video/mp4"></video></li>`;
    }
    if (g.type === 'before-after') {
        return `<li data-cat="${g.cat}" class="wide"><figure class="ba-pair">
                        <div><img src="${src(g.before)}" alt="${alt} – ${T[lang].gBefore}" loading="lazy" width="${g.w}" height="${g.h}"><span class="ba-tag">${T[lang].gBefore}</span></div>
                        <div><img src="${src(g.after)}" alt="${alt} – ${T[lang].gAfter}" loading="lazy" width="${g.w}" height="${g.h}"><span class="ba-tag ba-after">${T[lang].gAfter}</span></div>
                    </figure></li>`;
    }
    return `<li data-cat="${g.cat}"${g.tall ? ' class="tall"' : ''}><button type="button" class="gallery-item"><img src="${src(g.src)}" alt="${alt}" loading="lazy" width="${g.w}" height="${g.h}"></button></li>`;
}

for (const lang of LANGS) {
    const t = T[lang];
    const path = 'gallery/';
    const cats = GALLERY_CATS.filter((c) => GALLERY.some((g) => g.cat === c.key));
    write(lang, path, layout({
        lang, path, active: 'gallery', bodyClass: 'service-page gallery-page', title: t.gTitle, desc: t.gDesc,
        jsonld: { '@context': 'https://schema.org', '@graph': [
            { '@type': 'CollectionPage', '@id': `${abs(lang, path)}#page`, name: t.gH1, description: t.gDesc, url: abs(lang, path), inLanguage: lang, about: { '@id': BUSINESS_ID } },
            breadcrumbs([[t.home, abs(lang, '')], [NAV[lang].gallery, abs(lang, path)]])
        ] },
        body: ({ root: r, home }) => `${hero(lang, home, [[NAV[lang].gallery]], t.gH1, t.gLead)}

        <section class="section gallery">
            <div class="container">
                <div class="gallery-filters" role="toolbar" aria-label="${t.gFilter}">
                    <button type="button" class="chip is-active" data-filter="all" aria-pressed="true">${t.gAll}</button>
                    ${cats.map((c) => `<button type="button" class="chip" data-filter="${c.key}" aria-pressed="false">${esc(c[lang])}</button>`).join('\n                    ')}
                </div>
                <ul class="gallery-grid" id="gallery-grid">
                    ${GALLERY.map((g) => galleryItem(lang, g, r)).join('\n                    ')}
                </ul>
                <p class="gallery-cta"><span>${t.gMore}</span> <a href="https://www.facebook.com/profile.php?id=100068568395875" target="_blank" rel="noopener noreferrer">Facebook</a> · <a href="https://www.instagram.com/claucleaningcorp/" target="_blank" rel="noopener noreferrer">Instagram</a></p>
            </div>

            <dialog class="lightbox" id="lightbox" aria-label="${t.lbView}">
                <button type="button" class="lb-close" data-lb="close" aria-label="${t.lbClose}">&times;</button>
                <button type="button" class="lb-nav lb-prev" data-lb="prev" aria-label="${t.lbPrev}">&#8249;</button>
                <figure><img id="lb-img" src="data:," alt=""><figcaption id="lb-cap"></figcaption></figure>
                <button type="button" class="lb-nav lb-next" data-lb="next" aria-label="${t.lbNext}">&#8250;</button>
            </dialog>
        </section>

${band(lang, home)}`
    }));
}

// ---------- Our Clients ----------
for (const lang of LANGS) {
    const t = T[lang];
    const path = 'clients/';
    write(lang, path, layout({
        lang, path, active: 'clients', bodyClass: 'service-page clients-page', title: t.cTitle, desc: t.cDesc,
        jsonld: { '@context': 'https://schema.org', '@graph': [
            { '@type': 'CollectionPage', '@id': `${abs(lang, path)}#page`, name: t.cH1, description: t.cDesc, url: abs(lang, path), inLanguage: lang, about: { '@id': BUSINESS_ID },
                mainEntity: { '@type': 'ItemList', itemListElement: CLIENTS.map((c, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Organization', name: c.name } })) } },
            breadcrumbs([[t.home, abs(lang, '')], [NAV[lang].clients, abs(lang, path)]])
        ] },
        body: ({ root: r, home }) => `${hero(lang, home, [[NAV[lang].clients]], t.cH1, t.cLead)}

        <section class="trust-bar" aria-label="Highlights">
            <div class="container"><div class="trust-grid">
                ${t.cStats.map(([v, l]) => `<div class="trust-item"><strong>${v}</strong><span>${l}</span></div>`).join('\n                ')}
            </div></div>
        </section>

        ${CLIENT_GROUPS.map((g) => `<section class="section client-group">
            <div class="container">
                <div class="section-head">
                    <p class="eyebrow">${esc(g[lang])}</p>
                    <h2>${esc(lang === 'es' ? g.tagEs : g.tagEn).replace(/^./, (m) => m.toUpperCase())}</h2>
                </div>
                <ul class="client-cards">
                    ${CLIENTS.filter((c) => c.group === g.key).map((c) => clientCard(lang, c, r, home)).join('\n                    ')}
                </ul>
            </div>
        </section>`).join('\n\n        ')}

        <section class="section svc-ideal">
            <div class="container narrow">
                <div class="svc-area">
                    <h2>${t.cAreas}</h2>
                    <p>${t.cAreasText}</p>
                    ${['MA', 'NH'].map((st) => `<h3 class="area-state">${STATE_NAME[st]}</h3>
                    ${cityLinks(lang, home, st)}`).join('\n                    ')}
                </div>
            </div>
        </section>

${band(lang, home)}`
    }));
}

// ---------- Service areas index ----------
for (const lang of LANGS) {
    const t = T[lang];
    const path = 'service-areas/';
    write(lang, path, layout({
        lang, path, active: 'areas', title: t.aTitle, desc: t.aDesc,
        jsonld: { '@context': 'https://schema.org', '@graph': [
            { '@type': 'CollectionPage', '@id': `${abs(lang, path)}#page`, name: t.aH1, description: t.aDesc, url: abs(lang, path), inLanguage: lang, about: { '@id': BUSINESS_ID } },
            breadcrumbs([[t.home, abs(lang, '')], [t.areasCrumb, abs(lang, path)]])
        ] },
        body: ({ home }) => `${hero(lang, home, [[t.areasCrumb]], t.aH1, t.aLead)}

        ${['MA', 'NH'].map((st) => `<section class="section areas-state${st === 'NH' ? ' svc-ideal' : ''}">
            <div class="container">
                <div class="section-head"><h2>${STATE_NAME[st]}</h2></div>
                <ul class="city-cards">
                    ${CITY_LIST.filter((c) => c.state === st).map((c) => {
                        const n = clientsIn(c).length;
                        return `<li><a href="${home}service-areas/${citySlug(c)}/">
                        <strong>${esc(label(c))}</strong>
                        <span>${lang === 'es' ? `${t.aCounty} ${c.county}` : `${c.county} ${t.aCounty}`} · ${c.name === HQ.name ? t.aHome : t.aMiles(hqMiles(c))}</span>
                        ${n ? `<em>${t.aClients(n)}</em>` : ''}
                    </a></li>`;
                    }).join('\n                    ')}
                </ul>
            </div>
        </section>`).join('\n\n        ')}

${band(lang, home)}`
    }));
}

// ---------- City pages ----------
const CITY_SERVICES = ['commercial-cleaning', 'medical-office-cleaning', 'laboratory-cleaning', 'carpet-cleaning', 'floor-care', 'office-cleaning', 'car-dealership-cleaning', 'church-cleaning', 'school-cleaning'];

for (const c of CITY_LIST) {
    const here = clientsIn(c);
    const shown = here.length
        ? here
        : CLIENTS.map((x) => ({ x, d: Math.min(...x.cities.filter((l) => cityByLabel[l]).map((l) => miles(c, cityByLabel[l]))) }))
            .sort((a, b) => a.d - b.d).slice(0, 4).map(({ x }) => x);
    for (const lang of LANGS) {
        const t = T[lang];
        const path = `service-areas/${citySlug(c)}/`;
        const url = abs(lang, path);
        const faq = t.faq(c, here);
        write(lang, path, layout({
            lang, path, active: 'areas', title: t.cityTitle(c), desc: t.cityDesc(c),
            jsonld: { '@context': 'https://schema.org', '@graph': [
                {
                    '@type': 'Service', '@id': `${url}#service`, name: t.cityH1(c), serviceType: 'Commercial cleaning', description: t.cityDesc(c), url, inLanguage: lang,
                    provider: { '@id': BUSINESS_ID },
                    areaServed: { '@type': 'City', name: label(c), containedInPlace: { '@type': 'State', name: STATE_NAME[c.state] } },
                    hasOfferCatalog: { '@type': 'OfferCatalog', name: t.svcHere(c), itemListElement: CITY_SERVICES.map((s) => {
                        const svc = SERVICES.find((x) => x.slug === s);
                        return { '@type': 'Offer', itemOffered: { '@type': 'Service', name: svc[lang].name, url: abs(lang, `services/${s}/`) } };
                    }) }
                },
                breadcrumbs([[t.home, abs(lang, '')], [t.areasCrumb, abs(lang, 'service-areas/')], [label(c), url]]),
                faqPage(faq)
            ] },
            body: ({ root: r, home }) => `${hero(lang, home, [[t.areasCrumb, `${home}service-areas/`], [label(c)]], t.cityH1(c), t.cityLead(c))}

        <section class="section city-clients">
            <div class="container">
                <div class="section-head">
                    <p class="eyebrow">${lang === 'es' ? 'Clientes' : 'Clients'} · ${esc(label(c))}</p>
                    <h2>${esc(t.clientsHere(c, here.length))}</h2>
                    <p>${esc(t.clientsHereText(c, here.length))}</p>
                </div>
                <ul class="client-cards">
                    ${shown.map((x) => clientCard(lang, x, r, home, { city: c })).join('\n                    ')}
                </ul>
                <p class="center-link"><a href="${home}clients/" class="service-more">${t.allClients}</a></p>
            </div>
        </section>

        <section class="section services">
            <div class="container">
                <div class="section-head"><h2>${esc(t.svcHere(c))}</h2></div>
                <ul class="svc-related-grid svc-city-grid">
                    ${CITY_SERVICES.map((s) => {
                        const svc = SERVICES.find((x) => x.slug === s);
                        return `<li><a href="${home}services/${s}/"><span>${esc(svc[lang].name)}</span><p>${esc(svc[lang].short)}</p></a></li>`;
                    }).join('\n                    ')}
                </ul>
            </div>
        </section>

        <section class="section svc-detail">
            <div class="container svc-detail-grid">
                <div>
                    <p class="eyebrow">${lang === 'es' ? `Condado de ${esc(c.county)}` : `${esc(c.county)} County`} · ${STATE_NAME[c.state]}</p>
                    <h2>${esc(t.whyHere(c))}</h2>
                    <p class="svc-body">${esc(c[lang])}</p>
                    <ul class="check-list">
                        ${t.why.map((x) => `<li>${esc(x)}</li>`).join('\n                        ')}
                    </ul>
                </div>
                <div class="svc-area city-facilities">
                    <h2>${esc(t.facilitiesHere(c))}</h2>
                    <ul class="area-list">
                        ${t.facilities.map((x) => `<li>${esc(x)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>

        <section id="faq" class="section faq">
            <div class="container narrow">
                <div class="section-head"><h2>${t.faqTitle}</h2></div>
                ${faq.map(([q, a]) => `<details>
                    <summary>${esc(q)}</summary>
                    <p>${esc(a)}</p>
                </details>`).join('\n                ')}
                <div class="svc-area">
                    <h2>${t.nearby}</h2>
                    <ul class="area-list">
                        ${nearestCities(c, 6).map((x) => `<li><a href="../${citySlug(x)}/">${esc(label(x))}</a></li>`).join('')}
                    </ul>
                </div>
            </div>
        </section>

${band(lang, home)}`
        }));
    }
}
console.log(`gallery, clients, service areas and ${CITY_LIST.length} city pages written (EN + ES)`);

// ---------- Redirects for retired URLs (GitHub Pages has no server redirects) ----------
for (const [from, to] of Object.entries(REDIRECTS)) {
    for (const lang of LANGS) {
        const depth = from.split('/').filter(Boolean).length + (lang === 'es' ? 1 : 0);
        const target = abs(lang, to);
        write(lang, from, `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex">
    <title>Clau Cleaning Corp</title>
    <link rel="canonical" href="${target}">
    <meta http-equiv="refresh" content="0; url=${'../'.repeat(depth)}${lang === 'es' ? 'es/' : ''}${to}">
</head>
<body>
    <p><a href="${'../'.repeat(depth)}${lang === 'es' ? 'es/' : ''}${to}">${target}</a></p>
</body>
</html>
`);
    }
}

// ---------- sitemap.xml ----------
const today = new Date().toISOString().slice(0, 10);
const entry = (path, priority, bilingual = true) => {
    const en = path === 'privacy.html' ? `${SITE}/privacy.html` : abs('en', path);
    const es = abs('es', path);
    return [[en, priority], ...(bilingual ? [[es, Math.max(0.4, priority - 0.1).toFixed(1)]] : [])].map(([loc, pr]) => `  <url>
    <loc>${loc}</loc>${bilingual ? `
    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>` : ''}
    <lastmod>${today}</lastmod>
    <priority>${pr}</priority>
  </url>`).join('\n');
};
const featured = new Set(SERVICES.filter((s) => s.featured).map((s) => s.slug));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry('', 1.0)}
${SERVICES.map((s) => entry(`services/${s.slug}/`, featured.has(s.slug) ? 0.9 : 0.8)).join('\n')}
${entry('clients/', 0.8)}
${entry('gallery/', 0.7)}
${entry('service-areas/', 0.8)}
${CITY_LIST.map((c) => entry(`service-areas/${citySlug(c)}/`, 0.7)).join('\n')}
${entry('privacy.html', 0.3, false)}
</urlset>
`;
writeFileSync(join(root, 'sitemap.xml'), sitemap);
console.log('sitemap.xml written');
