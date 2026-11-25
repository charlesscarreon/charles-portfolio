/* Charles S. Carreon — portfolio enhancements.
   Pure progressive enhancement: the site is fully usable without this file. */
(function () {
    "use strict";

    var doc = document.documentElement;

    /* ---------- Theme toggle (dark default, persisted) ---------- */
    var STORAGE_KEY = "charles-portfolio-theme";

    function applyTheme(theme) {
        doc.setAttribute("data-theme", theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute("content", theme === "light" ? "#ebe7de" : "#0f1115");
        }
        var toggle = document.querySelector("[data-theme-toggle]");
        if (toggle) {
            toggle.setAttribute("aria-label", theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme");
        }
    }

    function initTheme() {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }
        if (saved !== "light" && saved !== "dark") {
            saved = "dark";
        }
        applyTheme(saved);

        var toggle = document.querySelector("[data-theme-toggle]");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var next = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
                applyTheme(next);
                try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* ignore */ }
            });
        }
    }

    /* ---------- Project image galleries -> simple carousel ---------- */
    function initGalleries() {
        var galleries = document.querySelectorAll(".gallery[data-gallery]");
        Array.prototype.forEach.call(galleries, function (gallery) {
            var images = gallery.querySelectorAll("img");
            if (images.length <= 1) {
                return;
            }

            gallery.classList.add("is-carousel");
            var index = 0;

            function show(i) {
                Array.prototype.forEach.call(images, function (img, n) {
                    img.classList.toggle("is-active", n === i);
                });
                /* The counter is a sibling of the gallery (inside nav), not a
                   descendant of it, so it must be queried from nav. */
                var count = nav.querySelector(".gallery-count");
                if (count) {
                    count.textContent = (i + 1) + " / " + images.length;
                }
            }

            var nav = document.createElement("div");
            nav.className = "gallery-nav";

            var prev = document.createElement("button");
            prev.type = "button";
            prev.textContent = "Previous";
            prev.setAttribute("aria-label", "Show previous image");

            var next = document.createElement("button");
            next.type = "button";
            next.textContent = "Next";
            next.setAttribute("aria-label", "Show next image");

            var count = document.createElement("span");
            count.className = "gallery-count";

            prev.addEventListener("click", function () {
                index = (index - 1 + images.length) % images.length;
                show(index);
            });

            next.addEventListener("click", function () {
                index = (index + 1) % images.length;
                show(index);
            });

            nav.appendChild(prev);
            nav.appendChild(count);
            nav.appendChild(next);
            gallery.parentNode.insertBefore(nav, gallery.nextSibling);

            show(0);
        });
    }

    /* ---------- Skip link: reveal on keyboard focus, hide on mouse ---------- */
    function initSkipLink() {
        var skip = document.querySelector(".skip-link");
        if (!skip) {
            return;
        }
        document.addEventListener("pointerdown", function () {
            skip.blur();
        }, true);
    }

    /* ---------- Table of contents: mark the section you are reading ---------- */
    function initToc() {
        var toc = document.querySelector(".toc");
        if (!toc) {
            return;
        }

        var links = toc.querySelectorAll("a[href^='#']");
        var items = [];

        Array.prototype.forEach.call(links, function (link) {
            var id = link.getAttribute("href").slice(1);
            var section = id ? document.getElementById(id) : null;
            if (section) {
                items.push({ link: link, section: section });
            }
        });

        if (!items.length) {
            return;
        }

        /* A section counts as current once its top has passed this line: the
           measured header plus a little slack, so the marker changes when the
           heading is actually readable rather than while it is under the bar.
           Measuring beats hardcoding, because scroll-padding-top and the
           header height are free to drift apart. The final section has a
           second, lower line because it sits near the end of the page and
           cannot always reach the top one before scrolling stops. */
        var header = document.querySelector(".site-header");
        var ticking = false;

        function mark(active) {
            Array.prototype.forEach.call(links, function (link) {
                if (active && link === active.link) {
                    link.setAttribute("aria-current", "true");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }

        function update() {
            ticking = false;

            var line = window.scrollY + (header ? header.offsetHeight : 0) + 24;
            var lastLine = window.scrollY + window.innerHeight * 0.6;
            var active = null;

            /* Last one past the line wins, so the marker only moves down. */
            for (var i = 0; i < items.length; i++) {
                var top = items[i].section.getBoundingClientRect().top + window.scrollY;
                if (top <= line || (i === items.length - 1 && top <= lastLine)) {
                    active = items[i];
                }
            }

            mark(active);
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        window.addEventListener("load", update);

        update();
    }

    /* ---------- Hero background: floating objects and circuit traces ---------- */
    function initHeroDecor() {
        var layer = document.querySelector(".hero-decor");
        if (!layer) {
            return;
        }

        var items = layer.querySelectorAll(".deco");
        var width = layer.offsetWidth;
        var height = layer.offsetHeight;
        if (!items.length || !width || !height || !layer.style || !layer.style.setProperty) {
            return;
        }

        function rand(min, max) {
            return min + Math.random() * (max - min);
        }

        /* The hero text is at most 46rem (736px) wide and centred. When the
           window leaves room beside it, the objects stay in those side bands;
           on narrow screens they sit behind the text, a little fainter. */
        function scatter() {
            var isHome = doc.classList.contains("home");
            var column = Math.min(736, width - 32);
            var side = (width - column) / 2;
            var bands = side >= 100;
            var first = Math.random() < 0.5 ? 0 : 1;
            var placed = [];
            var i, k, tries, size, w, h, x, y, onRight, rotation, clear, other;

            for (i = 0; i < items.length; i++) {
                size = Math.round(isHome ? rand(34, 66) : rand(28, 48));
                items[i].style.setProperty("--s", size + "px");
                w = items[i].offsetWidth || size;
                h = items[i].offsetHeight || size;
                onRight = (i + first) % 2 === 1;

                for (tries = 0; tries < 16; tries++) {
                    if (bands) {
                        x = rand(8, Math.max(8, side - w - 8));
                        if (onRight) {
                            x += width - side;
                        }
                    } else {
                        x = rand(0, Math.max(0, width - w));
                    }
                    y = isHome
                        ? rand(height * 0.04, Math.max(height * 0.04, height * 0.94 - h))
                        : rand(0, Math.max(0, height - h));

                    clear = true;
                    for (k = 0; k < placed.length; k++) {
                        other = placed[k];
                        if (Math.abs(other.x + other.w / 2 - x - w / 2) < (other.w + w) / 2 + 12
                            && Math.abs(other.y + other.h / 2 - y - h / 2) < (other.h + h) / 2 + 12) {
                            clear = false;
                            break;
                        }
                    }
                    if (clear) {
                        break;
                    }
                }
                placed.push({ x: x, y: y, w: w, h: h });

                rotation = rand(-25, 25);
                items[i].style.setProperty("--x", (x / width * 100).toFixed(2) + "%");
                items[i].style.setProperty("--y", (y / height * 100).toFixed(2) + "%");
                items[i].style.setProperty("--r0", rotation.toFixed(1) + "deg");
                items[i].style.setProperty("--r1", (rotation + rand(-30, 30)).toFixed(1) + "deg");
                items[i].style.setProperty("--dx", Math.round(rand(-22, 22)) + "px");
                items[i].style.setProperty("--dy", Math.round(rand(-22, 22)) + "px");
                items[i].style.setProperty("--dur", rand(18, 28).toFixed(1) + "s");
                items[i].style.setProperty("--delay", "-" + rand(0, 20).toFixed(1) + "s");
                items[i].style.setProperty("--o", (bands ? rand(0.12, 0.2) : rand(0.09, 0.14)).toFixed(2));
            }
        }

        /* Circuit traces on a grid: every line is horizontal or vertical,
           every turn a right angle, and each trace ends in a square pad. */
        function drawCircuit() {
            var NS = "http://www.w3.org/2000/svg";
            var step = 28;
            var cols = Math.floor(width / step);
            var rows = Math.floor(height / step);
            var traces = [];
            if (!document.createElementNS || cols < 4 || rows < 2) {
                return traces;
            }

            var svg = document.createElementNS(NS, "svg");
            svg.setAttribute("class", "hero-circuit");
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);
            svg.setAttribute("viewBox", "0 0 " + width + " " + height);
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("focusable", "false");

            var count = Math.min(150, Math.round(cols * rows / 11));
            var lines = ["", "", ""];
            var pads = "";
            var t, x, y, d, horizontal, segments, s, length, next, moved, startX, startY;

            for (t = 0; t < count; t++) {
                x = Math.floor(rand(0, cols + 1)) * step;
                y = Math.floor(rand(0, rows + 1)) * step;
                d = "M" + x + " " + y;
                startX = x;
                startY = y;
                pads += "M" + (x - 3) + " " + (y - 3) + "h6v6h-6z";
                horizontal = Math.random() < 0.5;
                segments = 2 + Math.floor(rand(0, 4));
                moved = false;

                for (s = 0; s < segments; s++) {
                    length = (1 + Math.floor(rand(0, 4))) * step * (Math.random() < 0.5 ? -1 : 1);
                    if (horizontal) {
                        next = Math.max(0, Math.min(width, x + length));
                        if (next !== x) {
                            d += "H" + next;
                            x = next;
                            moved = true;
                        }
                    } else {
                        next = Math.max(0, Math.min(height, y + length));
                        if (next !== y) {
                            d += "V" + next;
                            y = next;
                            moved = true;
                        }
                    }
                    horizontal = !horizontal;
                }

                if (moved) {
                    traces.push({ d: d, sx: startX, sy: startY, ex: x, ey: y });
                    lines[t % 3] += d;
                    pads += "M" + (x - 3) + " " + (y - 3) + "h6v6h-6z";
                }
            }

            var base = document.createElementNS(NS, "path");
            base.setAttribute("class", "hero-circuit__base");
            base.setAttribute("d", lines.join("") + pads);
            svg.appendChild(base);

            var n, pulse;
            for (n = 0; n < 3; n++) {
                pulse = document.createElementNS(NS, "path");
                pulse.setAttribute("class", "hero-circuit__pulse");
                pulse.setAttribute("d", lines[n]);
                svg.appendChild(pulse);
            }

            layer.insertBefore(svg, layer.firstChild);
            return traces;
        }

        /* Every so often, at a random place, one trace lights up and a short
           bright segment runs along it, like data being sent. */
        function startFlows(traces) {
            var NS = "http://www.w3.org/2000/svg";
            if (!traces.length || !document.createElementNS
                || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
                return;
            }

            var svg = document.createElementNS(NS, "svg");
            svg.setAttribute("class", "hero-flow");
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);
            svg.setAttribute("viewBox", "0 0 " + width + " " + height);
            svg.setAttribute("aria-hidden", "true");
            svg.setAttribute("focusable", "false");
            layer.appendChild(svg);

            function pad(x, y) {
                return "M" + (x - 3) + " " + (y - 3) + "h6v6h-6z";
            }

            function run() {
                var box = layer.getBoundingClientRect();
                var trace, line, dash, length, time;

                if (!document.hidden && box.bottom > 0 && box.top < window.innerHeight) {
                    trace = traces[Math.floor(Math.random() * traces.length)];
                    line = document.createElementNS(NS, "path");
                    line.setAttribute("class", "hero-flow__line");
                    line.setAttribute("d", trace.d + pad(trace.sx, trace.sy) + pad(trace.ex, trace.ey));
                    dash = document.createElementNS(NS, "path");
                    dash.setAttribute("class", "hero-flow__dash");
                    dash.setAttribute("d", trace.d);
                    svg.appendChild(line);
                    svg.appendChild(dash);

                    length = dash.getTotalLength ? dash.getTotalLength() : 200;
                    time = Math.max(1.1, Math.min(2.6, length / 150));
                    line.style.setProperty("--flow-time", time.toFixed(2) + "s");
                    dash.style.setProperty("--flow-time", time.toFixed(2) + "s");
                    dash.style.setProperty("--len", length.toFixed(1) + "px");

                    window.setTimeout(function () {
                        if (line.parentNode) {
                            line.parentNode.removeChild(line);
                        }
                        if (dash.parentNode) {
                            dash.parentNode.removeChild(dash);
                        }
                    }, time * 1000 + 300);
                }

                window.setTimeout(run, rand(2200, 6500));
            }

            window.setTimeout(run, 1500);
        }

        /* A few traces run on past the bottom of the hero, into the gap above
           the content. They sit in the side bands, clear of the text. */
        function drawTrail() {
            var hero = layer.parentNode;
            var NS = "http://www.w3.org/2000/svg";
            var step = 28;
            var trailHeight = 80;
            if (!hero || !document.createElementNS) {
                return;
            }

            var column = Math.min(736, width - 32);
            var side = (width - column) / 2;
            var bands = side >= 100;
            var count = bands ? 8 : 3;
            var d = "";
            var t, x, y, jog, mid, end, onRight;

            for (t = 0; t < count; t++) {
                if (bands) {
                    onRight = t % 2 === 1;
                    x = Math.floor(rand(0.5, side / step - 0.5)) * step;
                    if (onRight) {
                        x = width - x;
                    }
                } else {
                    x = Math.floor(rand(1, width / step - 1)) * step;
                }
                x = Math.round(x / step) * step;
                mid = Math.round(rand(16, 44));
                end = Math.round(rand(52, 76));
                jog = (Math.random() < 0.5 ? -1 : 1) * step * (1 + Math.floor(rand(0, 2)));
                y = 0;
                d += "M" + x + " " + y + "V" + mid + "H" + (x + jog) + "V" + end;
                d += "M" + (x + jog - 3) + " " + (end - 3) + "h6v6h-6z";
            }

            var trail = document.createElement("div");
            trail.className = "hero-trail";
            trail.setAttribute("aria-hidden", "true");
            var svg = document.createElementNS(NS, "svg");
            svg.setAttribute("width", width);
            svg.setAttribute("height", trailHeight);
            svg.setAttribute("viewBox", "0 0 " + width + " " + trailHeight);
            svg.setAttribute("focusable", "false");
            var path = document.createElementNS(NS, "path");
            path.setAttribute("d", d);
            svg.appendChild(path);
            trail.appendChild(svg);
            hero.appendChild(trail);
            return trail;
        }

        /* A glow and the nearby traces follow the mouse while it is over the
           hero. Only for a real pointer that can hover, never on touch. */
        function followPointer(trail) {
            if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches
                || !window.requestAnimationFrame) {
                return;
            }

            var px = 0;
            var py = 0;
            var queued = false;
            var lit = false;

            function update() {
                queued = false;
                var box = layer.getBoundingClientRect();
                var x = px - box.left;
                var y = py - box.top;
                var inside = x >= 0 && x <= box.width && y >= -30 && y <= box.height + 60;
                var tbox, strength;

                if (inside) {
                    /* Full light down to the middle of the hero, easing to
                       nothing by 85% of the way down, before the boundary
                       with the content. */
                    strength = (y - box.height * 0.5) / (box.height * 0.35);
                    strength = Math.max(0, Math.min(1, strength));
                    strength = 1 - strength * strength * (3 - 2 * strength);
                    layer.style.setProperty("--mx", x.toFixed(0) + "px");
                    layer.style.setProperty("--my", y.toFixed(0) + "px");
                    layer.style.setProperty("--lit", strength.toFixed(2));
                    if (trail) {
                        tbox = trail.getBoundingClientRect();
                        trail.style.setProperty("--mx", (px - tbox.left).toFixed(0) + "px");
                        trail.style.setProperty("--my", (py - tbox.top).toFixed(0) + "px");
                        trail.style.setProperty("--lit", strength.toFixed(2));
                    }
                    if (!lit) {
                        lit = true;
                        layer.classList.add("is-lit");
                        if (trail) {
                            trail.classList.add("is-lit");
                        }
                    }
                } else if (lit) {
                    lit = false;
                    layer.classList.remove("is-lit");
                    if (trail) {
                        trail.classList.remove("is-lit");
                    }
                }
            }

            function queue() {
                if (!queued) {
                    queued = true;
                    window.requestAnimationFrame(update);
                }
            }

            document.addEventListener("mousemove", function (event) {
                px = event.clientX;
                py = event.clientY;
                queue();
            });
            window.addEventListener("scroll", queue, { passive: true });
            document.documentElement.addEventListener("mouseleave", function () {
                px = -9999;
                queue();
            });
        }

        scatter();
        startFlows(drawCircuit());
        followPointer(drawTrail());
        layer.classList.add("is-ready");
    }

    /* ---------- Cover hero: scroll-linked shrink and direction cues ---------- */
    function initHeroCollapse() {
        var hero = document.querySelector(".hero");
        if (!doc.classList.contains("home") || !hero) {
            return;
        }

        var down = hero.querySelector(".scroll-cue--down");
        var downHref = down ? down.getAttribute("href") : null;
        var downTarget = downHref && downHref.charAt(0) === "#"
            ? document.getElementById(downHref.slice(1))
            : null;
        var cues = hero.querySelectorAll(".scroll-cue");
        var main = document.getElementById("main");
        var skip = document.querySelector(".skip-link");
        var ticking = false;

        function reduced() {
            return window.matchMedia
                && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }

        function update() {
            ticking = false;
            var progress = window.scrollY / (window.innerHeight * 0.45);
            progress = Math.max(0, Math.min(1, progress));
            doc.style.setProperty("--hero-progress", progress.toFixed(4));
            Array.prototype.forEach.call(cues, function (cue) {
                cue.hidden = progress >= 0.25;
            });
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }

        /* The target moves while the cover shrinks. Find the scroll position
           where the target stops moving by simulating progress and damping each
           step, then animate to that fixed point. Recomputing during the
           animation itself would oscillate. */
        function settledTarget(target) {
            var previous = doc.style.getPropertyValue("--hero-progress");
            var distance = window.innerHeight * 0.45;
            var candidate = Math.max(0, target());
            var progress;
            var next;
            var index;

            if (distance > 0) {
                for (index = 0; index < 20; index += 1) {
                    progress = Math.max(0, Math.min(1, candidate / distance));
                    doc.style.setProperty("--hero-progress", progress.toFixed(4));
                    next = Math.max(0, target());
                    if (Math.abs(next - candidate) <= 0.5) {
                        candidate = next;
                        break;
                    }
                    candidate = (candidate + next) / 2;
                }
            }

            if (previous) {
                doc.style.setProperty("--hero-progress", previous);
            } else {
                doc.style.removeProperty("--hero-progress");
            }
            return Math.max(0, candidate);
        }

        function scrollToTarget(target, instant) {
            function settle(passes) {
                update();
                var next = settledTarget(target);
                if (Math.abs(next - window.scrollY) <= 1 || passes >= 6) {
                    return;
                }
                window.scrollTo({ top: next, behavior: "instant" });
                window.requestAnimationFrame(function () {
                    settle(passes + 1);
                });
            }

            var destination = settledTarget(target);
            if (instant) {
                window.scrollTo({ top: destination, behavior: "instant" });
                window.requestAnimationFrame(function () {
                    settle(0);
                });
                return;
            }

            var start = window.scrollY;
            var started = null;
            var duration = 650;
            function frame(now) {
                if (started === null) {
                    started = now;
                }
                var t = Math.min(1, (now - started) / duration);
                var eased = 1 - Math.pow(1 - t, 3);
                window.scrollTo({ top: start + (destination - start) * eased, behavior: "instant" });
                if (t < 1) {
                    window.requestAnimationFrame(frame);
                } else {
                    settle(0);
                }
            }
            window.requestAnimationFrame(frame);
        }

        /* Deep links such as /projects#lunas land while the cover is still
           changing height. Settle the target after the initial layout and once
           images have finished loading. */
        function settleHashTarget() {
            if (!window.location.hash || window.location.hash.length < 2) {
                return;
            }
            var target = document.getElementById(window.location.hash.slice(1));
            /* A project panel is hidden until opened, so it has no position of
               its own. Settle on the project card that contains it instead, so
               the page behind the opened panel sits on that card. */
            if (target && target.classList.contains("project-dialog")) {
                target = target.closest ? target.closest(".project") : null;
            }
            if (!target) {
                return;
            }
            scrollToTarget(function () {
                return Math.max(0, target.getBoundingClientRect().top + window.scrollY - 16);
            }, true);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });

        if (down && downTarget) {
            down.addEventListener("click", function (event) {
                event.preventDefault();
                scrollToTarget(function () {
                    return Math.max(0, downTarget.getBoundingClientRect().top + window.scrollY - 16);
                }, reduced());
                try {
                    window.history.replaceState(null, "", downHref);
                } catch (e) { /* file:// or blocked history: the anchor still works without JS */ }
            });
        }

        /* The main target moves while the cover shrinks, so the skip link uses
           the same stepped scroll with only the normal 1rem padding. */
        if (skip && main) {
            skip.addEventListener("click", function (event) {
                event.preventDefault();
                if (main.focus) {
                    main.focus({ preventScroll: true });
                }
                scrollToTarget(function () {
                    return Math.max(0, main.getBoundingClientRect().top + window.scrollY - 16);
                }, reduced());
                try {
                    window.history.replaceState(null, "", "#main");
                } catch (e) { /* file:// or blocked history: the anchor still works without JS */ }
            });
        }

        update();
        settleHashTarget();
        window.addEventListener("load", settleHashTarget, { once: true });
    }

    /* ---------- Project detail dialogs ---------- */
    function initProjectDialogs() {
        var dialogs = document.querySelectorAll(".project-dialog");
        if (!dialogs.length) {
            return;
        }

        /* Without showModal() the panels simply stay visible inline, which is
           the same state as having no JavaScript at all. */
        if (typeof document.createElement("dialog").showModal !== "function") {
            return;
        }

        doc.classList.add("dialog-capable");

        function setHash(id) {
            try {
                var url = id ? "#" + id : window.location.pathname + window.location.search;
                window.history.replaceState(null, "", url);
            } catch (e) { /* file:// or blocked history: the dialog still works */ }
        }

        function open(dialog) {
            if (dialog.open) {
                return;
            }
            dialog.showModal();
            setHash(dialog.id);
        }

        Array.prototype.forEach.call(document.querySelectorAll("[data-dialog]"), function (trigger) {
            trigger.addEventListener("click", function (event) {
                var dialog = document.getElementById(trigger.getAttribute("data-dialog"));
                if (!dialog) {
                    return;
                }
                event.preventDefault();
                open(dialog);
            });
        });

        function isInteractive(target) {
            return target && target.closest
                && target.closest("a, button, input, select, textarea, dialog, [contenteditable]");
        }

        Array.prototype.forEach.call(document.querySelectorAll(".project"), function (card) {
            card.addEventListener("click", function (event) {
                if (event.defaultPrevented || event.button !== 0
                    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                    return;
                }
                if (isInteractive(event.target)) {
                    return;
                }
                var selection = window.getSelection();
                if (selection && selection.toString() && card.contains(selection.anchorNode)) {
                    return;
                }
                var trigger = card.querySelector(".project-detail-open[data-dialog]");
                if (trigger) {
                    trigger.click();
                }
            });
        });

        Array.prototype.forEach.call(dialogs, function (dialog) {
            /* The dialog itself has no padding, so any click that targets it is
               a click on the backdrop rather than on its contents. */
            dialog.addEventListener("click", function (event) {
                if (event.target === dialog) {
                    dialog.close();
                }
            });

            dialog.addEventListener("close", function () {
                if (!doc.querySelector(".project-dialog[open]")) {
                    setHash(null);
                }
            });
        });

        /* Print reveals every panel, so a screenshot that was never opened —
           and therefore never lazily loaded — is fetched before the printout
           rather than printed as an empty box. */
        window.addEventListener("beforeprint", function () {
            Array.prototype.forEach.call(document.querySelectorAll(".project-dialog img[loading]"), function (img) {
                img.loading = "eager";
            });
        });

        /* A shared link: /projects#outrun-detail opens that panel. It also
           works when the link is followed on the projects page itself (the
           footer links), where only the hash changes. */
        function openFromHash() {
            if (window.location.hash) {
                var linked = document.getElementById(window.location.hash.slice(1));
                if (linked && linked.classList.contains("project-dialog")) {
                    open(linked);
                }
            }
        }

        openFromHash();
        window.addEventListener("hashchange", openFromHash);
    }

    /* ---------- Get in touch: mail draft dialog ---------- */
    function initContactDialog() {
        var trigger = document.querySelector("[data-contact-open]");
        var dialog = document.getElementById("contact-dialog");
        if (!trigger || !dialog || typeof dialog.showModal !== "function") {
            return;
        }

        doc.classList.add("contact-capable");

        var message = dialog.querySelector("#contact-message");
        var subject = dialog.querySelector("#contact-subject");
        var close = dialog.querySelector("[data-contact-close]");
        var send = dialog.querySelector("[data-contact-send]");

        var reduceMotion = window.matchMedia
            && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        /* The button is wrapped so a second, panel-coloured button can sit
           behind it. On hover the teal button lifts and shows it below. */
        var wrap = document.createElement("span");
        wrap.className = "btn-reveal";
        trigger.parentNode.insertBefore(wrap, trigger);
        wrap.appendChild(trigger);
        trigger.classList.add("btn-reveal__front");

        var back = document.createElement("span");
        back.className = "btn-reveal__back";
        back.setAttribute("aria-hidden", "true");
        wrap.appendChild(back);

        var launching = false;

        /* The panel clipped down to the button's box, as a clip-path. */
        function buttonClip(from) {
            var box = dialog.getBoundingClientRect();
            return "inset(" + Math.max(0, from.top - box.top) + "px "
                + Math.max(0, box.right - from.right) + "px "
                + Math.max(0, box.bottom - from.bottom) + "px "
                + Math.max(0, from.left - box.left) + "px round " + (from.height / 2) + "px)";
        }

        function open(from) {
            if (!dialog.open) {
                dialog.showModal();
            }
            if (message && message.focus) {
                try { message.focus({ preventScroll: true }); } catch (error) { message.focus(); }
            }

            if (!from || reduceMotion || !dialog.animate) {
                return;
            }

            /* The panel grows out of the button: it is clipped to the
               button's box at first, and the clip opens up to the full panel.
               The panel and the button are the same colour, so it reads as
               one shape expanding. */
            var startClip = buttonClip(from);
            var timing = { duration: 460, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" };

            dialog.animate([
                { clipPath: startClip },
                { clipPath: "inset(0px 0px 0px 0px round 14px)" }
            ], timing);
            dialog.animate([
                { opacity: 0 },
                { opacity: 1, offset: 0.2 },
                { opacity: 1 }
            ], timing);

            var body = dialog.querySelector(".contact-dialog__body");
            if (body) {
                body.animate([
                    { opacity: 0 },
                    { opacity: 0, offset: 0.4 },
                    { opacity: 1 }
                ], timing);
            }

            try {
                dialog.animate([{ opacity: 0 }, { opacity: 1 }],
                    { duration: 320, pseudoElement: "::backdrop" });
            } catch (error) { /* no animated backdrop: the dialog still opens */ }
        }

        /* The panel expands out of the button behind the teal one. The two
           buttons act as one, so a click on either, or Enter on the link, does
           the same. */
        function launch(event) {
            event.preventDefault();
            if (launching || dialog.open) {
                return;
            }
            launching = true;
            var from = wrap.getBoundingClientRect();
            wrap.classList.add("is-open");
            open(from);
        }

        wrap.addEventListener("click", launch);

        /* Closing is the opening played backwards: the panel shrinks back into
           the button behind the teal one, then the teal button slides down. */
        var closing = false;

        function closeAnimated() {
            if (!dialog.open || closing) {
                return;
            }
            if (reduceMotion || !dialog.animate) {
                dialog.close();
                return;
            }

            closing = true;
            var timing = { duration: 380, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" };
            var animations = [
                dialog.animate([
                    { clipPath: "inset(0px 0px 0px 0px round 14px)" },
                    { clipPath: buttonClip(wrap.getBoundingClientRect()) }
                ], timing),
                dialog.animate([
                    { opacity: 1 },
                    { opacity: 1, offset: 0.8 },
                    { opacity: 0 }
                ], timing)
            ];

            var body = dialog.querySelector(".contact-dialog__body");
            if (body) {
                animations.push(body.animate([
                    { opacity: 1 },
                    { opacity: 0, offset: 0.4 },
                    { opacity: 0 }
                ], timing));
            }

            try {
                animations.push(dialog.animate([{ opacity: 1 }, { opacity: 0 }],
                    { duration: 380, fill: "forwards", pseudoElement: "::backdrop" }));
            } catch (error) { /* no animated backdrop */ }

            animations[0].onfinish = function () {
                dialog.close();
                var i;
                for (i = 0; i < animations.length; i++) {
                    animations[i].cancel();
                }
                closing = false;
            };
        }

        dialog.addEventListener("close", function () {
            launching = false;
            wrap.classList.remove("is-open");
        });

        /* Escape goes through the same animation as the Close button. */
        dialog.addEventListener("cancel", function (event) {
            event.preventDefault();
            closeAnimated();
        });

        if (close) {
            close.addEventListener("click", closeAnimated);
        }

        /* The dialog itself has no padding, so a click that targets it lands on
           the backdrop rather than on its contents. */
        dialog.addEventListener("click", function (event) {
            if (event.target === dialog) {
                closeAnimated();
            }
        });

        if (send) {
            send.addEventListener("click", function () {
                var body = message ? message.value : "Hi Charles,";
                var value = subject && subject.value ? subject.value : "Portfolio Inquiry";
                window.location.href = "mailto:charlesserranocarreon+portfolio@gmail.com?subject="
                    + encodeURIComponent(value) + "&body=" + encodeURIComponent(body);
            });
        }
    }

    /* ---------- Recommendation form: a picked choice can be clicked again to clear it ----------
       Radio buttons cannot be unticked by the browser. The answer stays required,
       so submitting with none picked is still blocked by the form. */
    function initChoiceToggle() {
        var inputs = document.querySelectorAll(".recommendation-form__chip input");
        if (!inputs.length) {
            return;
        }
        var last = null;
        var i;
        for (i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                last = inputs[i];
            }
        }
        function onClick(event) {
            var input = event.currentTarget;
            if (input === last) {
                input.checked = false;
                last = null;
            } else {
                last = input;
            }
        }
        for (i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("click", onClick);
        }
        /* A form reset (see initFormClear) unticks everything, so forget the last pick. */
        if (inputs[0].form) {
            inputs[0].form.addEventListener("reset", function () {
                last = null;
            });
        }
    }

    /* ---------- Recommendation form: empty again after a successful send ----------
       The "Check your email" page leaves a note in this tab. When the form page is shown
       again (the back button restores what was typed), the form is cleared once and the
       note removed, so a second press of Submit cannot send the same recommendation twice.
       A failed attempt leaves no note, so people keep their text after a mistake.
       Without JavaScript the server's own cooldown is the only protection. */
    function initFormClear() {
        var form = document.querySelector(".recommendation-form");
        if (!form) {
            return;
        }
        function clearIfSent() {
            var sent = false;
            try {
                sent = window.sessionStorage.getItem("recs-sent") === "1";
                if (sent) {
                    window.sessionStorage.removeItem("recs-sent");
                }
            } catch (e) {
                return;
            }
            if (!sent) {
                return;
            }
            /* Some browsers put the typed text back a moment after the page is shown. */
            form.reset();
            window.setTimeout(function () { form.reset(); }, 0);
            window.setTimeout(function () { form.reset(); }, 200);
        }
        window.addEventListener("pageshow", clearIfSent);
    }

    /* Enable JS-specific UI (theme toggle visibility, etc.) */
    doc.classList.remove("no-js");
    doc.classList.add("js");

    initTheme();
    initSkipLink();
    initGalleries();
    initHeroCollapse();
    initHeroDecor();
    initToc();
    initProjectDialogs();
    initContactDialog();
    initChoiceToggle();
    initFormClear();
})();