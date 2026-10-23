// Google Analytics 4. Kept in its own file so the Content-Security-Policy does not
// need to allow inline scripts. Paste the Measurement ID (G-XXXXXXXXXX) from
// analytics.google.com → Admin → Data streams to turn it on; empty means disabled.
(function () {
    'use strict';
    var GA_ID = '';
    if (!GA_ID) return;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });

    // Count calls, WhatsApp chats and quote requests as key events.
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href');
        if (href.indexOf('tel:') === 0) window.gtag('event', 'click_call', { link_url: href });
        else if (href.indexOf('wa.me') !== -1) window.gtag('event', 'click_whatsapp', { link_url: href });
    });
    document.addEventListener('quote_sent', function () { window.gtag('event', 'generate_lead'); });
})();
