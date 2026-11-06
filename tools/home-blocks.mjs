// Parts of the home page that come from the data files, so services, clients and
// cities are listed the same way everywhere. index.html marks each part with
//   <!-- block:name --> ... <!-- /block:name -->
// tools/build-home.mjs fills them in English; tools/build-es.mjs fills them in Spanish.
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, SERVICES } from './services-data.mjs';
import { CITY_LIST, CLIENTS, STATE_NAME, citySlug } from './locations-data.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const L = {
    en: { more: 'Learn more →', core: 'Core service', other: 'Other', select: 'Select a service' },
    es: { more: 'Ver más →', core: 'Servicio principal', other: 'Otro', select: 'Seleccione un servicio' }
};

function logoFile(slug) {
    for (const ext of ['svg', 'png', 'webp', 'jpg', 'jpeg']) if (existsSync(join(root, 'assets/img/clients', `${slug}.${ext}`))) return `assets/img/clients/${slug}.${ext}`;
    return null;
}
const initials = (name) => name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join('').slice(0, 4);

export function blocks(lang, rootRel) {
    const l = L[lang];
    const ind = (n) => ' '.repeat(n);
    return {
        services: SERVICES.map((s) => {
            const t = s[lang];
            return `${ind(20)}<article class="service-card${s.featured ? ' is-featured' : ''}">
${ind(24)}<img src="${esc(/^https?:/.test(s.image) ? s.image.replace('w=1200', 'w=700') : rootRel + s.image)}" alt="${esc(t.imageAlt)}" loading="lazy" width="700" height="467" data-ph="offices">
${ind(24)}<div class="service-body">
${ind(28)}${s.featured ? `<p class="service-tag">${l.core}</p>\n${ind(28)}` : ''}<h3><a href="services/${s.slug}/">${esc(t.name)}</a></h3>
${ind(28)}<p>${esc(t.short)}</p>
${ind(28)}<ul>
${t.bullets.map((b) => `${ind(32)}<li>${esc(b)}</li>`).join('\n')}
${ind(28)}</ul>
${ind(28)}<a class="service-more" href="services/${s.slug}/">${l.more}</a>
${ind(24)}</div>
${ind(20)}</article>`;
        }).join('\n'),

        'form-options': [
            `${ind(28)}<option value="">${l.select}</option>`,
            ...SERVICES.map((s) => `${ind(28)}<option value="${s.formValue}">${esc(s[lang].name)}</option>`),
            `${ind(28)}<option value="other">${l.other}</option>`
        ].join('\n'),

        'footer-services': SERVICES.map((s) => `${ind(20)}<li><a href="services/${s.slug}/">${esc(s[lang].name)}</a></li>`).join('\n'),

        'area-lists': ['MA', 'NH'].map((st) => `${ind(20)}<h4 class="area-state">${STATE_NAME[st]}</h4>
${ind(20)}<ul class="area-list area-links">
${CITY_LIST.filter((c) => c.state === st).map((c) => `${ind(24)}<li><a href="service-areas/${citySlug(c)}/">${esc(c.name)}</a></li>`).join('\n')}
${ind(20)}</ul>`).join('\n'),

        'client-strip': CLIENTS.map((c) => {
            const f = logoFile(c.slug);
            const mark = f ? `<img src="${rootRel}${f}" alt="${esc(c.name)} logo" loading="lazy" width="200" height="80">` : `<span class="client-mark" aria-hidden="true">${esc(initials(c.name))}</span>`;
            return `${ind(20)}<li class="client-logo">${mark}<span class="client-name">${esc(c.name)}</span><small>${esc(c.cities.length > 2 ? `${c.cities.length + (c.extra || []).length} ${lang === 'es' ? 'sedes en MA y NH' : 'locations in MA & NH'}` : c.cities.join(' · '))}</small></li>`;
        }).join('\n'),

        'footer-areas': `${ind(12)}<p><strong>${lang === 'es' ? 'Atendemos' : 'Serving'}:</strong> ${CITY_LIST.map((c) => `<a href="service-areas/${citySlug(c)}/">${esc(c.name)}, ${c.state}</a>`).join(' · ')}</p>`,

        jsonld: `${ind(4)}<script type="application/ld+json">
${JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness', 'ProfessionalService'],
            '@id': `${SITE}/#business`,
            name: 'Clau Cleaning Corp',
            description: 'Commercial cleaning company based in Dracut, MA, serving Northern Massachusetts and Southern New Hampshire. Specialized in doctor\'s offices, medical facilities and laboratories, plus clinics, hospitals, offices, car dealerships, churches and schools, commercial carpet cleaning and floor care.',
            url: `${SITE}/`,
            logo: `${SITE}/assets/img/icon-512.png`,
            image: `${SITE}/assets/img/og-image.jpg`,
            telephone: '+1-978-328-2406',
            email: 'claucleaningcorpc2@gmail.com',
            priceRange: '$$',
            address: { '@type': 'PostalAddress', streetAddress: '1734 Lakeview Ave #169', addressLocality: 'Dracut', addressRegion: 'MA', postalCode: '01826', addressCountry: 'US' },
            geo: { '@type': 'GeoCoordinates', latitude: 42.6787, longitude: -71.3242 },
            areaServed: CITY_LIST.map((c) => ({ '@type': 'City', name: `${c.name}, ${c.state}`, url: `${SITE}/service-areas/${citySlug(c)}/` })),
            hasMap: 'https://www.google.com/maps/search/?api=1&query=1734+Lakeview+Ave+Dracut+MA+01826',
            knowsLanguage: ['en', 'es'],
            sameAs: ['https://www.facebook.com/profile.php?id=100068568395875', 'https://www.instagram.com/claucleaningcorp/'],
            hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Commercial cleaning services',
                itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.en.name, url: `${SITE}/services/${s.slug}/` } }))
            }
        }, null, 4).replace(/^/gm, ind(4))}
${ind(4)}</script>`
    };
}

// Replaces every <!-- block:name -->...<!-- /block:name --> in html. Fails on a missing block.
export function fill(html, lang, rootRel) {
    for (const [name, content] of Object.entries(blocks(lang, rootRel))) {
        const re = new RegExp(`(<!-- block:${name} -->)[\\s\\S]*?(\\s*<!-- /block:${name} -->)`);
        if (!re.test(html)) throw new Error(`index.html is missing <!-- block:${name} -->`);
        html = html.replace(re, (_, a, b) => `${a}\n${content}${b}`);
    }
    return html;
}
