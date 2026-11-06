// Generates one indexable page per service, in English (services/<slug>/) and
// Spanish (es/services/<slug>/), from tools/services-data.mjs.
// Run after editing the data:  npm run build
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMON, SERVICES } from './services-data.mjs';
import { CITY_LIST, STATE_NAME, citySlug } from './locations-data.mjs';
import { layout, esc, svg, ICON, abs, BUSINESS_ID, breadcrumbs, faqPage } from './layout.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function structuredData(lang, svc) {
    const t = svc[lang];
    const c = COMMON[lang];
    const url = abs(lang, `services/${svc.slug}/`);
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': `${url}#service`,
                name: t.name,
                serviceType: svc.serviceType,
                description: t.metaDesc,
                url,
                image: svc.image,
                inLanguage: lang,
                provider: { '@id': BUSINESS_ID },
                areaServed: [
                    { '@type': 'State', name: 'Massachusetts' },
                    { '@type': 'State', name: 'New Hampshire' },
                    ...CITY_LIST.map((x) => ({ '@type': 'City', name: `${x.name}, ${x.state}` }))
                ]
            },
            breadcrumbs([[c.home, abs(lang, '')], [c.services, `${abs(lang, '')}#services`], [t.name, url]]),
            faqPage(t.faq)
        ]
    };
}

function body(lang, svc) {
    const t = svc[lang];
    const c = COMMON[lang];
    const related = SERVICES.filter((s) => s.slug !== svc.slug);
    return ({ home }) => `        <section class="svc-hero">
            <img class="svc-hero-bg" src="${esc(svc.image)}" alt="" data-ph="hide" width="1200" height="800" fetchpriority="high">
            <div class="container svc-hero-content">
                <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${home}">${c.home}</a> <span aria-hidden="true">›</span> <a href="${home}#services">${c.services}</a> <span aria-hidden="true">›</span> <span aria-current="page">${esc(t.name)}</span></nav>
                <h1>${esc(t.h1)}</h1>
                <p class="hero-lead">${esc(t.lead)}</p>
                <div class="hero-actions">
                    <a href="${home}#quote" class="btn btn-primary btn-lg">${c.quote}</a>
                    <a href="tel:+19783282406" class="btn btn-ghost btn-lg">${svg(ICON.phone)}<span>+1 978-328-2406</span></a>
                </div>
            </div>
        </section>

        <section class="section svc-detail">
            <div class="container svc-detail-grid">
                <div>
                    <p class="eyebrow">${esc(t.name)}</p>
                    <h2>${c.included}</h2>
                    <p class="svc-body">${esc(t.body)}</p>
                    <ul class="check-list">
                        ${t.included.map((x) => `<li>${esc(x)}</li>`).join('\n                        ')}
                    </ul>
                </div>
                <figure class="svc-figure">
                    <img src="${esc(svc.image.replace('w=1200', 'w=900'))}" alt="${esc(t.imageAlt)}" loading="lazy" width="900" height="600" data-ph="disinfection">
                </figure>
            </div>
        </section>

        <section class="section svc-ideal">
            <div class="container">
                <h2>${c.ideal}</h2>
                <ul class="svc-ideal-grid">
                    ${t.ideal.map((x) => `<li>${svg(ICON.check)}<span>${esc(x)}</span></li>`).join('\n                    ')}
                </ul>
            </div>
        </section>

        <section class="section process">
            <div class="container">
                <div class="section-head"><h2>${c.how}</h2></div>
                <ol class="process-grid">
                    ${c.steps.map(([h, p], i) => `<li><span class="step">${i + 1}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('\n                    ')}
                </ol>
            </div>
        </section>

        <section id="faq" class="section faq">
            <div class="container narrow">
                <div class="section-head"><h2>${c.faq}</h2></div>
                ${t.faq.map(([q, a]) => `<details>
                    <summary>${esc(q)}</summary>
                    <p>${esc(a)}</p>
                </details>`).join('\n                ')}
                <div class="svc-area">
                    <h2>${c.areaTitle}</h2>
                    <p>${c.areaText}</p>
                    ${['MA', 'NH'].map((st) => `<h3 class="area-state">${STATE_NAME[st]}</h3>
                    <ul class="area-list">
                        ${CITY_LIST.filter((x) => x.state === st).map((x) => `<li><a href="${home}service-areas/${citySlug(x)}/">${esc(x.name)}, ${st}</a></li>`).join('')}
                    </ul>`).join('\n                    ')}
                </div>
            </div>
        </section>

        <section class="svc-band">
            <div class="container svc-band-inner">
                <div>
                    <h2>${c.bandTitle}</h2>
                    <p>${c.bandText}</p>
                </div>
                <div class="svc-band-actions">
                    <a href="${home}#quote" class="btn btn-primary btn-lg">${c.quote}</a>
                    <a href="https://wa.me/19783282406" class="btn btn-ghost btn-lg" target="_blank" rel="noopener noreferrer">${svg(ICON.wa)}<span>${c.whatsapp}</span></a>
                </div>
            </div>
        </section>

        <section class="section svc-related">
            <div class="container">
                <div class="section-head"><h2>${c.related}</h2></div>
                <ul class="svc-related-grid">
                    ${related.map((s) => `<li><a href="../${s.slug}/"><span>${esc(s[lang].name)}</span><small>${c.more}</small></a></li>`).join('\n                    ')}
                </ul>
            </div>
        </section>`;
}

let count = 0;
for (const svc of SERVICES) {
    for (const lang of ['en', 'es']) {
        const t = svc[lang];
        const path = `services/${svc.slug}/`;
        const dir = join(root, lang === 'es' ? 'es' : '', path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), layout({
            lang, path, active: 'services', title: t.metaTitle, desc: t.metaDesc,
            jsonld: structuredData(lang, svc), body: body(lang, svc),
            imageAlt: `${t.name} – Clau Cleaning Corp`
        }));
        count++;
    }
}
console.log(`${count} service pages written (services/ and es/services/)`);
