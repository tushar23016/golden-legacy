
/* =========================================
   GOLDEN LEGACY — LOADING SCREEN
========================================= */

(() => {
    "use strict";

    const loadingScreen = document.getElementById("loading-screen");

    // Stop if the page has no loading screen
    if (!loadingScreen) {
        return;
    }

    // Prevent scrolling while loading
    document.body.classList.add("is-loading");

    // Hide and remove the loading screen
    function hideLoadingScreen() {
        loadingScreen.classList.add("loaded");

        document.body.classList.remove("is-loading");

        // Remove loader after the fade-out animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 1000);
    }

    // Hide loader when all page resources have loaded
    if (document.readyState === "complete") {
        hideLoadingScreen();
    } else {
        window.addEventListener("load", hideLoadingScreen, {
            once: true
        });
    }

    // Safety fallback: never leave the loader stuck
    setTimeout(() => {
        if (document.getElementById("loading-screen")) {
            hideLoadingScreen();
        }
    }, 5000);

})();