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
            meta.setAttribute("content", theme === "light" ? "#f7f8fa" : "#0f1115");
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
           header height are free to drift apart. */
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
            var active = null;

            /* Last one past the line wins, so the marker only moves down. */
            for (var i = 0; i < items.length; i++) {
                var top = items[i].section.getBoundingClientRect().top + window.scrollY;
                if (top <= line) {
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

    /* Enable JS-specific UI (theme toggle visibility, etc.) */
    doc.classList.remove("no-js");
    doc.classList.add("js");

    initTheme();
    initSkipLink();
    initGalleries();
    initToc();
})();