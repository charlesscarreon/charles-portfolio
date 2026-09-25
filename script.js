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
                var count = gallery.querySelector(".gallery-count");
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

    /* Enable JS-specific UI (theme toggle visibility, etc.) */
    doc.classList.remove("no-js");
    doc.classList.add("js");

    initTheme();
    initSkipLink();
    initGalleries();
})();