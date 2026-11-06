// Shared <head>, header and footer for every generated page (services, gallery,
// clients, service areas). The home page (index.html) has the same markup by hand.
import { SITE, SERVICES } from './services-data.mjs';
import { CITY_LIST, citySlug } from './locations-data.mjs';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const NAV = {
    en: { skip: 'Skip to content', menu: 'Open menu', home: 'Home', about: 'About', services: 'Services', gallery: 'Gallery', clients: 'Our Clients', areas: 'Service Areas', contact: 'Contact', quote: 'Free Quote',
        tagline: 'Commercial cleaning, medical facility cleaning, carpet cleaning and floor care in Northern Massachusetts and Southern New Hampshire.',
        footServices: 'Services', footLinks: 'Company', footContact: 'Contact', serving: 'Serving', privacy: 'Privacy Policy', rights: 'All rights reserved.', call: 'Call +1 978-328-2406', fabOpen: 'Call or text us', fabCall: 'Call', fabSms: 'Text (SMS)' },
    es: { skip: 'Saltar al contenido', menu: 'Abrir menú', home: 'Inicio', about: 'Nosotros', services: 'Servicios', gallery: 'Galería', clients: 'Nuestros Clientes', areas: 'Zonas de Servicio', contact: 'Contacto', quote: 'Cotización Gratis',
        tagline: 'Limpieza comercial, limpieza de instalaciones médicas, limpieza de alfombras y cuidado de pisos en el norte de Massachusetts y el sur de New Hampshire.',
        footServices: 'Servicios', footLinks: 'Empresa', footContact: 'Contacto', serving: 'Atendemos', privacy: 'Política de privacidad', rights: 'Todos los derechos reservados.', call: 'Llame al +1 978-328-2406', fabOpen: 'Llámenos o escríbanos', fabCall: 'Llamar', fabSms: 'Enviar SMS' }
};

export const ICON = {
    phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z',
    wa: 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z',
    fb: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z',
    ig: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
    check: 'M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z',
    sms: 'M4 3h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8l-5 4V4a1 1 0 0 1 1-1zm3 6v2h2V9zm4 0v2h2V9zm4 0v2h2V9z',
    close: 'M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z',
    pin: 'M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 4.5A2.5 2.5 0 1 0 12 11.5 2.5 2.5 0 0 0 12 6.5z'
};
export const svg = (d) => `<svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="${d}"/></svg>`;

// Absolute URL of a page path ('' = home, 'services/x/' ...) in a language.
export const abs = (lang, path) => `${SITE}${lang === 'es' ? '/es' : ''}/${path}`;

const CSP = "default-src 'self'; img-src 'self' data: https://images.pexels.com https://www.googletagmanager.com https://*.google-analytics.com; media-src 'self'; style-src 'self'; font-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests";

/**
 * Full page wrapper.
 * path: page path without language prefix, e.g. 'services/floor-care/' or 'gallery/'.
 * active: nav key to mark as current ('gallery' | 'clients' | 'areas' | 'services').
 */
export function layout({ lang, path, title, desc, jsonld, body, active = '', bodyClass = 'service-page', image = `${SITE}/assets/img/og-image.jpg`, imageAlt = 'Clau Cleaning Corp' }) {
    const n = NAV[lang];
    const depth = path.split('/').filter(Boolean).length + (lang === 'es' ? 1 : 0);
    const root = '../'.repeat(depth);                       // site root (assets, privacy)
    const home = root + (lang === 'es' ? 'es/' : '');       // home page in the same language
    const enHref = '../'.repeat(depth) + path;
    const esHref = '../'.repeat(depth) + 'es/' + path;
    const cur = (k) => (k === active ? ' aria-current="page"' : '');
    const url = abs(lang, path);
    const main = body({ root, home });
    // Only pages that still show a Pexels photo need the early connection to Pexels.
    const preconnect = main.includes('images.pexels.com') ? '\n    <link rel="preconnect" href="https://images.pexels.com">' : '';

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Generated by tools/build-*.mjs from the data files in tools/. Edit the data there, not this file. -->
    <meta http-equiv="Content-Security-Policy" content="${CSP}">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#0F3D25">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="en" href="${abs('en', path)}">
    <link rel="alternate" hreflang="es" href="${abs('es', path)}">
    <link rel="alternate" hreflang="x-default" href="${abs('en', path)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Clau Cleaning Corp">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${esc(image)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(imageAlt)}">
    <meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'es_US'}">
    <meta property="og:locale:alternate" content="${lang === 'en' ? 'es_US' : 'en_US'}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${esc(image)}">
    <link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="${root}favicon.ico" sizes="32x32">
    <link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
    <link rel="manifest" href="${root}site.webmanifest">${preconnect}
    <link rel="preload" href="${root}assets/fonts/comfortaa-var-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${root}assets/css/styles.css">
    <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
    </script>
    <script src="${root}assets/js/analytics.js" defer></script>
    <script src="${root}assets/js/main.js" defer></script>
</head>

<body class="${bodyClass}">
    <a class="skip-link" href="#main">${n.skip}</a>

    <header class="site-header" id="top">
        <div class="container header-inner">
            <a class="brand" href="${home}" aria-label="Clau Cleaning Corp – ${n.home}">
                <img src="${root}assets/img/logo-horizontal.svg" alt="Clau Cleaning Corp logo" width="320" height="42">
            </a>
            <button class="menu-toggle" id="menu-toggle" aria-controls="nav-menu" aria-expanded="false" aria-label="${n.menu}">
                <span></span><span></span><span></span>
            </button>
            <nav class="site-nav" aria-label="Main">
                <ul id="nav-menu">
                    <li><a href="${home}#services"${cur('services')}>${n.services}</a></li>
                    <li><a href="${home}gallery/"${cur('gallery')}>${n.gallery}</a></li>
                    <li><a href="${home}clients/"${cur('clients')}>${n.clients}</a></li>
                    <li><a href="${home}service-areas/"${cur('areas')}>${n.areas}</a></li>
                    <li><a href="${home}#about">${n.about}</a></li>
                    <li><a href="${home}#contact">${n.contact}</a></li>
                    <li class="lang-item">
                        <div class="lang-switch" role="group" aria-label="Language / Idioma">
                            <a href="${enHref}" hreflang="en" lang="en"${lang === 'en' ? ' class="is-active" aria-current="true"' : ''}>EN</a>
                            <a href="${esHref}" hreflang="es" lang="es"${lang === 'es' ? ' class="is-active" aria-current="true"' : ''}>ES</a>
                        </div>
                    </li>
                    <li class="nav-cta-item"><a href="${home}#quote" class="btn btn-primary btn-sm">${n.quote}</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main id="main">
${main}
    </main>

${footer(lang, root, home)}
</body>
</html>
`;
}

export function footer(lang, root, home) {
    const n = NAV[lang];
    return `    <footer class="site-footer">
        <div class="container footer-grid">
            <div class="footer-brand">
                <img src="${root}assets/img/logo-white.svg" alt="Clau Cleaning Corp" width="200" height="110">
                <p>${n.tagline}</p>
                <div class="social">
                    <a href="https://www.facebook.com/profile.php?id=61595804780839" target="_blank" rel="noopener noreferrer" aria-label="Clau Cleaning Corp on Facebook">${svg(ICON.fb)}</a>
                    <a href="https://wa.me/19783282406" target="_blank" rel="noopener noreferrer" aria-label="Clau Cleaning Corp on WhatsApp">${svg(ICON.wa)}</a>
                    <a href="https://www.instagram.com/claucleaning/" target="_blank" rel="noopener noreferrer" aria-label="Clau Cleaning Corp on Instagram">${svg(ICON.ig)}</a>
                </div>
            </div>
            <div>
                <h3>${n.footServices}</h3>
                <ul>
                    ${SERVICES.map((s) => `<li><a href="${home}services/${s.slug}/">${esc(s[lang].name)}</a></li>`).join('\n                    ')}
                </ul>
            </div>
            <div>
                <h3>${n.footLinks}</h3>
                <ul>
                    <li><a href="${home}#about">${n.about}</a></li>
                    <li><a href="${home}gallery/">${n.gallery}</a></li>
                    <li><a href="${home}clients/">${n.clients}</a></li>
                    <li><a href="${home}service-areas/">${n.areas}</a></li>
                    <li><a href="${home}#quote">${n.quote}</a></li>
                    <li><a href="${root}privacy.html">${n.privacy}</a></li>
                </ul>
            </div>
            <div>
                <h3>${n.footContact}</h3>
                <address>
                    <a href="tel:+19783282406">+1 978-328-2406</a><br>
                    <a href="mailto:claucleaningcorpc1@gmail.com">claucleaningcorpc1@gmail.com</a><br>
                    1734 Lakeview Ave #169<br>Dracut, MA 01826
                </address>
            </div>
        </div>
        <div class="container footer-areas">
            <p><strong>${n.serving}:</strong> ${CITY_LIST.map((c) => `<a href="${home}service-areas/${citySlug(c)}/">${esc(c.name)}, ${c.state}</a>`).join(' · ')}</p>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; <span id="year">2026</span> Clau Cleaning Corp. ${n.rights}</p>
            </div>
        </div>
    </footer>

    ${fab(n)}`;
}

// Floating contact button on every page: opens two options, call and text (SMS).
// A <details> element, so it works without JavaScript; main.js closes it on outside click / Escape.
export const fab = (n) => `<details class="fab" data-fab>
        <summary class="fab-toggle" aria-label="${n.fabOpen}">${svg(ICON.phone).replace('<svg', '<svg class="fab-ico-open"')}${svg(ICON.close).replace('<svg', '<svg class="fab-ico-close"')}<span class="fab-label">${n.fabOpen}</span></summary>
        <div class="fab-menu">
            <a href="tel:+19783282406" class="fab-opt">${svg(ICON.phone)}<span>${n.fabCall}<small>+1 978-328-2406</small></span></a>
            <a href="sms:+19783282406" class="fab-opt">${svg(ICON.sms)}<span>${n.fabSms}<small>+1 978-328-2406</small></span></a>
        </div>
    </details>`;

// LocalBusiness used as provider in every page's structured data. Google does not join
// @id references across pages, so each page carries the business name, phone and address
// itself (the full profile, with services and service area, is on the home page).
export const BUSINESS_ID = `${SITE}/#business`;
export const BUSINESS = {
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': BUSINESS_ID,
    name: 'Clau Cleaning Corp',
    url: `${SITE}/`,
    logo: `${SITE}/assets/img/icon-512.png`,
    image: `${SITE}/assets/img/og-image.jpg`,
    telephone: '+1-978-328-2406',
    email: 'claucleaningcorpc1@gmail.com',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: '1734 Lakeview Ave #169', addressLocality: 'Dracut', addressRegion: 'MA', postalCode: '01826', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 42.6787, longitude: -71.3242 },
    sameAs: ['https://www.facebook.com/profile.php?id=61595804780839', 'https://www.instagram.com/claucleaning/']
};

// Share image (og:image) for a page photo. Social networks need a JPG/PNG around 1200x630,
// so each photo has a JPG copy in assets/img/og/<name>.jpg (see README). Falls back to the
// branded card when there is no copy (for example a remote Pexels photo).
export function ogImage(photo) {
    const name = photo && !/^https?:/.test(photo) ? photo.split('/').pop().replace(/\.\w+$/, '') : '';
    return name && existsSync(join(SITE_ROOT, 'assets/img/og', `${name}.jpg`)) ? `${SITE}/assets/img/og/${name}.jpg` : `${SITE}/assets/img/og-image.jpg`;
}

export function breadcrumbs(items) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item }))
    };
}

export function faqPage(faq) {
    return {
        '@type': 'FAQPage',
        mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    };
}
