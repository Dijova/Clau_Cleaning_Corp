/* Gallery motion (GSAP): animated filtering (Flip), before/after drag slider
   (Draggable), staggered scroll reveal (ScrollTrigger) and a lightbox that grows
   from the clicked photo. Loaded only on pages with a gallery, before main.js.
   Everything is progressive enhancement: without GSAP the gallery works as before,
   and with "reduce motion" on, only the (user-driven) slider is kept. */
(function () {
    'use strict';
    if (!window.gsap) return;
    var gsap = window.gsap;
    var hasFlip = !!window.Flip, hasST = !!window.ScrollTrigger, hasDrag = !!window.Draggable;
    gsap.registerPlugin.apply(gsap, [window.Flip, window.ScrollTrigger, window.Draggable].filter(Boolean));

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var es = (document.documentElement.lang || '').indexOf('es') === 0;

    /* ---------- Before / after slider ---------- */
    function initSlider(fig) {
        var halves = fig.children;
        if (halves.length < 2 || fig.classList.contains('ba-slider')) return;
        var li = fig.closest('li');
        if (li) li.classList.add('ba-li');
        fig.classList.add('ba-slider');

        var handle = document.createElement('div');
        handle.className = 'ba-handle';
        handle.tabIndex = 0;
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', es ? 'Comparar antes y después' : 'Compare before and after');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        var knob = document.createElement('span');
        knob.className = 'ba-knob';
        knob.setAttribute('aria-hidden', 'true');
        handle.appendChild(knob);
        fig.appendChild(handle);

        var pos = { v: 50 };
        function render() {
            fig.style.setProperty('--pos', pos.v + '%');
            handle.setAttribute('aria-valuenow', String(Math.round(pos.v)));
        }
        function setTo(v, animate) {
            v = Math.max(0, Math.min(100, v));
            gsap.killTweensOf(pos);
            if (animate && !reduce) gsap.to(pos, { v: v, duration: 0.45, ease: 'power3.out', onUpdate: render });
            else { pos.v = v; render(); }
        }
        function fromPointer(x, animate) {
            var r = fig.getBoundingClientRect();
            setTo(((x - r.left) / r.width) * 100, animate);
        }
        render();

        if (hasDrag) {
            // A detached proxy: dragging anywhere on the photo moves the divider,
            // while vertical swipes still scroll the page on touch screens.
            window.Draggable.create(document.createElement('div'), {
                trigger: fig, type: 'x', allowNativeTouchScrolling: true, cursor: 'ew-resize',
                onPress: function () { fromPointer(this.pointerX, true); },
                onDrag: function () { fromPointer(this.pointerX, false); }
            });
        } else {
            fig.addEventListener('click', function (e) { fromPointer(e.clientX, true); });
        }

        handle.addEventListener('keydown', function (e) {
            var step = e.shiftKey ? 20 : 5;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setTo(pos.v - step, true);
            else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setTo(pos.v + step, true);
            else if (e.key === 'Home') setTo(0, true);
            else if (e.key === 'End') setTo(100, true);
            else return;
            e.preventDefault();
        });

        // A one-time "peek" when the slider scrolls into view, so people see it moves.
        if (hasST && !reduce) {
            window.ScrollTrigger.create({
                trigger: fig, start: 'top 75%', once: true,
                onEnter: function () {
                    gsap.timeline({ delay: 0.3, onUpdate: render })
                        .to(pos, { v: 22, duration: 0.7, ease: 'power2.inOut' })
                        .to(pos, { v: 78, duration: 0.9, ease: 'power2.inOut' })
                        .to(pos, { v: 50, duration: 0.6, ease: 'power2.out' });
                }
            });
        }
    }
    document.querySelectorAll('.ba-pair').forEach(initSlider);

    /* ---------- Staggered reveal on scroll ---------- */
    if (hasST && !reduce) {
        var tiles = gsap.utils.toArray('.gallery-grid > li');
        if (tiles.length) {
            gsap.set(tiles, { autoAlpha: 0, y: 48 });
            window.ScrollTrigger.batch(tiles, {
                start: 'top 92%', once: true,
                onEnter: function (batch) {
                    gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09, overwrite: true });
                }
            });
        }
    }

    /* ---------- Hooks used by main.js ---------- */
    window.ClauGallery = {
        // Animated filter: apply() changes the "hidden" flags, Flip animates the difference.
        filter: function (grid, apply) {
            if (!hasFlip || reduce) { apply(); return; }
            var items = grid.querySelectorAll(':scope > li');
            // Finish any pending scroll reveal first, so Flip starts from a settled grid.
            gsap.killTweensOf(items);
            gsap.set(items, { autoAlpha: 1, y: 0, scale: 1 });
            var state = window.Flip.getState(items);
            apply();
            window.Flip.from(state, {
                duration: 0.7, ease: 'power3.inOut', stagger: 0.012, absoluteOnLeave: true, nested: true,
                onEnter: function (els) {
                    return gsap.fromTo(els, { autoAlpha: 0, scale: 0.85, y: 0 },
                        { autoAlpha: 1, scale: 1, duration: 0.55, delay: 0.15, ease: 'back.out(1.4)' });
                },
                onLeave: function (els) {
                    return gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' });
                },
                onComplete: function () {
                    // Tiles shown by the filter count as revealed.
                    gsap.set(grid.querySelectorAll(':scope > li:not([hidden])'), { autoAlpha: 1, y: 0, clearProps: 'transform' });
                    if (hasST) window.ScrollTrigger.refresh();
                }
            });
        },

        // Lightbox opens by growing out of the clicked thumbnail.
        open: function (thumb, lb, img) {
            if (reduce) return;
            var chrome = lb.querySelectorAll('.lb-close, .lb-nav, figcaption');
            gsap.fromTo(chrome, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, delay: 0.25 });
            var run = function () {
                var a = thumb.getBoundingClientRect(), b = img.getBoundingClientRect();
                if (!b.width || !a.width) { gsap.fromTo(img, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.4 }); return; }
                gsap.fromTo(img, {
                    x: (a.left + a.width / 2) - (b.left + b.width / 2),
                    y: (a.top + a.height / 2) - (b.top + b.height / 2),
                    scale: Math.max(a.width / b.width, a.height / b.height) * 0.9, autoAlpha: 0.4
                }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power3.out' });
            };
            gsap.set(img, { autoAlpha: 0 });
            if (img.decode) img.decode().then(run, run); else run();
        },

        // Prev / next: slide the current photo out and the next one in.
        swap: function (img, dir, change) {
            if (reduce) { change(); return; }
            gsap.timeline()
                .to(img, { x: -60 * dir, autoAlpha: 0, duration: 0.2, ease: 'power2.in' })
                .call(change)
                .fromTo(img, { x: 60 * dir }, { x: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' });
        }
    };
})();
