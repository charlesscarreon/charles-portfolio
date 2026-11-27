/* Runs before first paint, so nothing visibly changes after the page appears. Loaded as
   a normal script in <head> (not deferred). It does two things. First, it applies the
   saved theme, so light-theme visitors do not see a dark flash; the storage key is the
   same as in script.js, and without JavaScript the page keeps the dark default set on
   the html element. Second, on the pages with the full-screen cover it adds the
   hero-cover class, so the cover is laid out at full height from the first paint. If
   that waited for script.js (deferred), the cover would first paint short and then jump
   to full height, which shifts the whole page. This is an external file so the
   Content-Security-Policy does not need to allow inline scripts. */
try {
    var savedTheme = localStorage.getItem("charles-portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
} catch (error) { /* storage blocked: keep the dark default */ }

/* The cover layout only needs the home class; the collapse progress defaults to 0 in the
   stylesheet, and script.js takes over the scroll-linked part when it loads. */
if (document.documentElement.classList.contains("home")) {
    document.documentElement.classList.add("hero-cover");
}
