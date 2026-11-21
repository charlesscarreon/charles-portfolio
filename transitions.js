/* Charles S. Carreon: page transitions.
   Pure progressive enhancement. The slide and fade between pages is done by the
   browser (cross-document view transitions, styled in styles.css); this tiny
   script only tells the stylesheet which way the page is moving. Browsers
   without the feature simply load pages as usual. It is loaded from <head>
   because the "pagereveal" event can fire before a deferred script runs. */
(function () {
    "use strict";

    var KEY = "charles-portfolio-from";

    /* The subpages in the order their sections appear on the homepage. Moving
       to one lower in the list is a downward move, higher is upward. */
    var ORDER = ["/projects", "/achievements", "/skills", "/experience", "/recommendations"];

    function normalise(pathname) {
        var path = String(pathname || "/").toLowerCase();
        path = path.replace(/\.html$/, "").replace(/\/index$/, "");
        if (path.length > 1) {
            path = path.replace(/\/+$/, "");
        }
        return path === "" ? "/" : path;
    }

    function remember() {
        try {
            window.sessionStorage.setItem(KEY, normalise(window.location.pathname));
        } catch (error) { /* storage blocked: the pages just cross-fade */ }
    }

    function recall() {
        var from = null;
        try {
            from = window.sessionStorage.getItem(KEY);
        } catch (error) { from = null; }

        if (!from && document.referrer) {
            var link = document.createElement("a");
            link.href = document.referrer;
            if (link.host === window.location.host) {
                from = normalise(link.pathname);
            }
        }
        return from;
    }

    /* Which way the new page arrives: "forward" (home to a subpage), "back"
       (a subpage to home), or "down" / "up" between subpages. Anything else
       gets no slide, only a fade. */
    function direction(from, to) {
        var a = ORDER.indexOf(from);
        var b = ORDER.indexOf(to);

        if (!from || from === to) {
            return null;
        }
        if (from === "/" && b !== -1) {
            return "forward";
        }
        if (to === "/" && a !== -1) {
            return "back";
        }
        if (a !== -1 && b !== -1) {
            return b > a ? "down" : "up";
        }
        return null;
    }

    window.addEventListener("pageswap", remember);
    window.addEventListener("pagehide", remember);

    window.addEventListener("pagereveal", function (event) {
        if (!event.viewTransition) {
            return;
        }

        var root = document.documentElement;
        var way = direction(recall(), normalise(window.location.pathname));
        if (way) {
            root.setAttribute("data-vt", way);
        }

        function clear() {
            root.removeAttribute("data-vt");
        }
        if (event.viewTransition.finished && event.viewTransition.finished.then) {
            event.viewTransition.finished.then(clear, clear);
        }
    });
})();
