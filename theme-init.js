/* Applies the saved theme before first paint, so light-theme visitors do not see a
   dark flash. Loaded as a normal script in <head> (not deferred). The storage key is
   the same as in script.js. Without JavaScript the page keeps the dark default set
   on the html element. This is an external file so the Content-Security-Policy does
   not need to allow inline scripts. */
try {
    var savedTheme = localStorage.getItem("charles-portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
} catch (error) { /* storage blocked: keep the dark default */ }
