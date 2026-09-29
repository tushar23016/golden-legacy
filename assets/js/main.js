
/* ============================================================
   GOLDEN LEGACY
   MAIN JAVASCRIPT CONTROLLER
   ============================================================ */

"use strict";


/* ============================================================
   01. GLOBAL CONFIGURATION
   ============================================================ */

const GoldenLegacy = {
    config: {
        siteName: "Golden Legacy",

        selectors: {
            loadingScreen: "#loading-screen",
            siteWrapper: "#site-wrapper",
            header: ".site-header",
            menuToggle: ".menu-toggle",
            navigation: ".site-nav",
            backToTop: ".back-to-top"
        },

        settings: {
            enableSmoothScroll: true,
            enableBackToTop: true,
            enableConsoleMessage: true
        }
    },

    state: {
        isInitialized: false,
        isPageLoaded: false,
        isMenuOpen: false
    }
};


/* ============================================================
   02. DOM SELECTORS
   ============================================================ */

const DOM = {
    get(selector, parent = document) {
        return parent.querySelector(selector);
    },

    getAll(selector, parent = document) {
        return [...parent.querySelectorAll(selector)];
    },

    exists(selector, parent = document) {
        return Boolean(this.get(selector, parent));
    }
};


/* ============================================================
   03. INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    if (GoldenLegacy.state.isInitialized) {
        return;
    }

    GoldenLegacy.state.isInitialized = true;

    initializeWebsite();
});


function initializeWebsite() {
    console.log("Golden Legacy: Initializing website...");

    initializePageState();
    initializeSmoothScroll();
    initializeBackToTop();
    initializeHeader();
    initializeExternalLinks();
    initializeAccessibility();

    GoldenLegacy.state.isPageLoaded = true;

    document.dispatchEvent(
        new CustomEvent("goldenlegacy:ready")
    );

    if (GoldenLegacy.config.settings.enableConsoleMessage) {
        console.log(
            "%c GOLDEN LEGACY ",
            "background: #d4af37; color: #050505; font-size: 16px; font-weight: bold; padding: 8px;"
        );

        console.log(
            "Luxury memories. Timeless connections."
        );
    }
}


/* ============================================================
   04. PAGE STATE
   ============================================================ */

function initializePageState() {
    document.documentElement.classList.add("js-enabled");

    document.body.classList.add("page-ready");

    const currentPage = window.location.pathname;

    document.body.dataset.page =
        currentPage.split("/").pop().replace(".html", "") || "home";
}


/* ============================================================
   05. SMOOTH SCROLL
   ============================================================ */

function initializeSmoothScroll() {
    if (!GoldenLegacy.config.settings.enableSmoothScroll) {
        return;
    }

    DOM.getAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = DOM.get(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            closeMobileMenu();
        });
    });
}


/* ============================================================
   06. HEADER SCROLL EFFECT
   ============================================================ */

function initializeHeader() {
    const header = DOM.get(
        GoldenLegacy.config.selectors.header
    );

    if (!header) {
        return;
    }

    let previousScrollPosition = window.scrollY;
    let ticking = false;

    function updateHeader() {
        const currentScrollPosition = window.scrollY;

        header.classList.toggle(
            "header-scrolled",
            currentScrollPosition > 50
        );

        if (currentScrollPosition <= 50) {
            header.classList.remove("header-hidden");
        }

        previousScrollPosition = currentScrollPosition;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    updateHeader();
}


/* ============================================================
   07. MOBILE NAVIGATION
   ============================================================ */

function initializeMobileNavigation() {
    const menuToggle = DOM.get(
        GoldenLegacy.config.selectors.menuToggle
    );

    const navigation = DOM.get(
        GoldenLegacy.config.selectors.navigation
    );

    if (!menuToggle || !navigation) {
        return;
    }

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        toggleMobileMenu();
    });

    DOM.getAll("a", navigation).forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    document.addEventListener("click", event => {
        if (
            GoldenLegacy.state.isMenuOpen &&
            !navigation.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });
}


function toggleMobileMenu() {
    const menuToggle = DOM.get(
        GoldenLegacy.config.selectors.menuToggle
    );

    const navigation = DOM.get(
        GoldenLegacy.config.selectors.navigation
    );

    if (!menuToggle || !navigation) {
        return;
    }

    GoldenLegacy.state.isMenuOpen =
        !GoldenLegacy.state.isMenuOpen;

    menuToggle.classList.toggle(
        "active",
        GoldenLegacy.state.isMenuOpen
    );

    navigation.classList.toggle(
        "nav-open",
        GoldenLegacy.state.isMenuOpen
    );

    document.body.classList.toggle(
        "menu-open",
        GoldenLegacy.state.isMenuOpen
    );

    menuToggle.setAttribute(
        "aria-expanded",
        String(GoldenLegacy.state.isMenuOpen)
    );
}


function closeMobileMenu() {
    const menuToggle = DOM.get(
        GoldenLegacy.config.selectors.menuToggle
    );

    const navigation = DOM.get(
        GoldenLegacy.config.selectors.navigation
    );

    GoldenLegacy.state.isMenuOpen = false;

    menuToggle?.classList.remove("active");
    navigation?.classList.remove("nav-open");

    document.body.classList.remove("menu-open");

    menuToggle?.setAttribute("aria-expanded", "false");
}


/* ============================================================
   08. BACK TO TOP
   ============================================================ */

function initializeBackToTop() {
    if (!GoldenLegacy.config.settings.enableBackToTop) {
        return;
    }

    const button = DOM.get(
        GoldenLegacy.config.selectors.backToTop
    );

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        button.classList.toggle(
            "visible",
            window.scrollY > 500
        );
    }, { passive: true });
}


/* ============================================================
   09. EXTERNAL LINKS
   ============================================================ */

function initializeExternalLinks() {
    DOM.getAll('a[href^="http"]').forEach(link => {
        const linkURL = new URL(
            link.href,
            window.location.href
        );

        if (linkURL.hostname !== window.location.hostname) {
            link.setAttribute("target", "_blank");

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }
    });
}


/* ============================================================
   10. ACCESSIBILITY
   ============================================================ */

function initializeAccessibility() {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {
        document.documentElement.classList.add(
            "reduced-motion"
        );
    }

    reducedMotion.addEventListener("change", event => {
        document.documentElement.classList.toggle(
            "reduced-motion",
            event.matches
        );
    });
}


/* ============================================================
   11. PAGE UTILITIES
   ============================================================ */

const PageUtils = {
    getQueryParameter(name) {
        const parameters = new URLSearchParams(
            window.location.search
        );

        return parameters.get(name);
    },

    getCurrentPage() {
        return document.body.dataset.page || "home";
    },

    isMobile() {
        return window.matchMedia(
            "(max-width: 768px)"
        ).matches;
    },

    isReducedMotion() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }
};


/* ============================================================
   12. GLOBAL EXPORTS
   ============================================================ */

window.GoldenLegacy = GoldenLegacy;
window.PageUtils = PageUtils;
window.DOM = DOM;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;