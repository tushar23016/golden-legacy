/* =========================================================
   GOLDEN LEGACY — NAVIGATION CONTROLLER
   File: assets/js/navigation.js

   Compatible with the Golden Legacy shared header:
   - .site-header
   - .header-container
   - .nav-container / .main-navigation
   - #primary-navigation / #main-navigation
   - .mobile-menu-toggle / .nav-toggle
   - .navigation-link

   Features:
   - Mobile navigation open/close
   - Accessible ARIA state and focus handling
   - Escape and outside-click handling
   - Same-page smooth scrolling
   - Active page/section navigation link
   - Header scroll effect
   - Responsive navigation reset
   - Reduced-motion support
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.querySelector(".site-header");
    const headerContainer = document.querySelector(".header-container");

    // Support both existing HTML and legacy navigation classes.
    const navigation =
        document.querySelector("#primary-navigation") ||
        document.querySelector("#main-navigation") ||
        document.querySelector(".nav-container") ||
        document.querySelector(".main-navigation");

    const menuToggle =
        document.querySelector(".mobile-menu-toggle") ||
        document.querySelector(".nav-toggle");

    const mobileBreakpoint = window.matchMedia("(max-width: 900px)");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (!header || !navigation || !menuToggle) {
        console.warn(
            "Golden Legacy: Navigation elements were not found. Check the shared header markup."
        );
        return;
    }

    const navigationLinks = navigation.querySelectorAll(
        ".navigation-link, a[href]"
    );

    const overlay = document.querySelector(".mobile-nav-overlay");

    let menuIsOpen = false;

    // Preserve an existing navigation ID.
    if (!navigation.id) {
        navigation.id = "primary-navigation";
    }

    menuToggle.setAttribute("aria-controls", navigation.id);
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.setAttribute("type", "button");

    /* =====================================================
       1. ACCESSIBILITY STATE
       ===================================================== */

    function setMenuAccessibility(isOpen) {
        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

        navigation.setAttribute(
            "aria-hidden",
            mobileBreakpoint.matches
                ? String(!isOpen)
                : "false"
        );

        if ("inert" in navigation) {
            navigation.inert =
                mobileBreakpoint.matches && !isOpen;
        }

        if (overlay) {
            overlay.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );
        }
    }

    /* =====================================================
       2. MOBILE MENU FUNCTIONS
       ===================================================== */

    function openMenu() {
        if (!mobileBreakpoint.matches || menuIsOpen) {
            return;
        }

        menuIsOpen = true;

        navigation.classList.add("active");
        menuToggle.classList.add("active");

        body.classList.add("nav-open");

        if (overlay) {
            overlay.classList.add("active");
        }

        setMenuAccessibility(true);
    }

    function closeMenu(returnFocus = false) {
        const wasOpen = menuIsOpen;

        menuIsOpen = false;

        navigation.classList.remove("active");
        menuToggle.classList.remove("active");

        body.classList.remove("nav-open");

        if (overlay) {
            overlay.classList.remove("active");
        }

        setMenuAccessibility(false);

        if (returnFocus && wasOpen) {
            menuToggle.focus();
        }
    }

    function toggleMenu() {
        if (menuIsOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /* =====================================================
       3. HAMBURGER BUTTON
       ===================================================== */

    menuToggle.addEventListener("click", (event) => {
        event.preventDefault();

        toggleMenu();
    });

    /* =====================================================
       4. MOBILE NAVIGATION OVERLAY
       ===================================================== */

    if (overlay) {
        overlay.addEventListener("click", () => {
            closeMenu();
        });
    }

    /* =====================================================
       5. CLOSE MENU WHEN A LINK IS CLICKED
       ===================================================== */

    navigationLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (mobileBreakpoint.matches) {
                closeMenu();
            }
        });
    });

    /* =====================================================
       6. CLOSE MENU WITH ESCAPE KEY
       ===================================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuIsOpen) {
            closeMenu(true);
        }
    });

    /* =====================================================
       7. CLOSE MENU WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener("click", (event) => {
        if (!menuIsOpen) {
            return;
        }

        const clickedNavigation =
            navigation.contains(event.target);

        const clickedToggle =
            menuToggle.contains(event.target);

        const clickedHeader = headerContainer
            ? headerContainer.contains(event.target)
            : header.contains(event.target);

        const clickedOverlay =
            overlay && overlay.contains(event.target);

        if (
            !clickedNavigation &&
            !clickedToggle &&
            !clickedHeader &&
            !clickedOverlay
        ) {
            closeMenu();
        }
    });

    /* =====================================================
       8. RESPONSIVE NAVIGATION
       ===================================================== */

    function handleBreakpointChange() {
        if (mobileBreakpoint.matches) {
            setMenuAccessibility(menuIsOpen);
        } else {
            closeMenu();

            setMenuAccessibility(false);
        }
    }

    if (
        typeof mobileBreakpoint.addEventListener === "function"
    ) {
        mobileBreakpoint.addEventListener(
            "change",
            handleBreakpointChange
        );
    } else {
        // Compatibility with older browsers.
        mobileBreakpoint.addListener(
            handleBreakpointChange
        );
    }

    /* =====================================================
       9. HEADER SCROLL EFFECT
       ===================================================== */

    function updateHeader() {
        header.classList.toggle(
            "scrolled",
            window.scrollY > 50
        );
    }

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();

    /* =====================================================
       10. NORMALIZE PAGE PATH
       ===================================================== */

    function normalizePath(pathname) {
        const decoded = decodeURIComponent(
            pathname || "/"
        );

        const withoutTrailingSlash =
            decoded.replace(/\/+$/, "");

        return withoutTrailingSlash || "/";
    }

    /* =====================================================
       11. ACTIVE PAGE NAVIGATION LINK
       ===================================================== */

    function updateActivePageLink() {
        const currentPath = normalizePath(
            window.location.pathname
        );

        const currentHash = window.location.hash;

        navigationLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            let linkURL;

            try {
                linkURL = new URL(
                    href,
                    window.location.href
                );
            } catch {
                return;
            }

            const sameOrigin =
                linkURL.origin === window.location.origin;

            const samePage =
                sameOrigin &&
                normalizePath(linkURL.pathname) ===
                    currentPath;

            const isActivePage =
                samePage &&
                (!linkURL.hash ||
                    linkURL.hash === currentHash);

            if (isActivePage) {
                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                link.classList.remove("active");

                if (
                    link.getAttribute("aria-current") ===
                    "page"
                ) {
                    link.removeAttribute("aria-current");
                }
            }
        });
    }

    /* =====================================================
       12. ACTIVE SECTION NAVIGATION LINK
       ===================================================== */

    function updateActiveSection(activeId) {
        navigationLinks.forEach((link) => {
            const href = link.getAttribute("href");

            if (!href) {
                return;
            }

            let linkURL;

            try {
                linkURL = new URL(
                    href,
                    window.location.href
                );
            } catch {
                return;
            }

            const samePage =
                linkURL.origin === window.location.origin &&
                normalizePath(linkURL.pathname) ===
                    normalizePath(window.location.pathname);

            const targetId = linkURL.hash
                ? decodeURIComponent(
                    linkURL.hash.slice(1)
                )
                : "";

            if (
                samePage &&
                targetId &&
                targetId === activeId
            ) {
                link.classList.add("active");

                link.setAttribute(
                    "aria-current",
                    "location"
                );
            } else if (
                link.getAttribute("aria-current") ===
                "location"
            ) {
                link.classList.remove("active");

                link.removeAttribute("aria-current");
            }
        });
    }

    /* =====================================================
       13. SMOOTH SAME-PAGE SCROLLING
       ===================================================== */

    document
        .querySelectorAll('a[href*="#"]')
        .forEach((link) => {
            link.addEventListener("click", (event) => {
                const href =
                    link.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                let targetURL;

                try {
                    targetURL = new URL(
                        href,
                        window.location.href
                    );
                } catch {
                    return;
                }

                // Only handle links pointing to this page.
                if (
                    targetURL.origin !==
                        window.location.origin ||
                    normalizePath(targetURL.pathname) !==
                        normalizePath(
                            window.location.pathname
                        ) ||
                    !targetURL.hash
                ) {
                    return;
                }

                let targetId;

                try {
                    targetId = decodeURIComponent(
                        targetURL.hash.slice(1)
                    );
                } catch {
                    return;
                }

                const targetElement =
                    document.getElementById(targetId);

                if (!targetElement) {
                    return;
                }

                event.preventDefault();

                if (mobileBreakpoint.matches) {
                    closeMenu();
                }

                const headerHeight =
                    header.offsetHeight;

                const targetPosition =
                    targetElement
                        .getBoundingClientRect()
                        .top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: Math.max(
                        0,
                        targetPosition
                    ),

                    behavior: prefersReducedMotion.matches
                        ? "auto"
                        : "smooth"
                });

                // Update the URL without causing another jump.
                if (
                    window.location.hash !==
                    targetURL.hash
                ) {
                    history.pushState(
                        null,
                        "",
                        targetURL.hash
                    );
                }

                updateActiveSection(targetId);
            });
        });

    /* =====================================================
       14. DETECT ACTIVE SECTION WHILE SCROLLING
       ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id], section[id]"
    );

    if (
        "IntersectionObserver" in window &&
        sections.length
    ) {
        const sectionObserver =
            new IntersectionObserver(
                (entries) => {
                    const visibleSections = entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        );

                    if (visibleSections.length) {
                        updateActiveSection(
                            visibleSections[0].target.id
                        );
                    }
                },
                {
                    root: null,

                    rootMargin:
                        "-25% 0px -60% 0px",

                    threshold: [
                        0,
                        0.1,
                        0.25,
                        0.5,
                        0.75
                    ]
                }
            );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    /* =====================================================
       15. INITIAL ACTIVE LINK
       ===================================================== */

    updateActivePageLink();

    if (window.location.hash) {
        let initialId;

        try {
            initialId = decodeURIComponent(
                window.location.hash.slice(1)
            );
        } catch {
            initialId = "";
        }

        if (
            initialId &&
            document.getElementById(initialId)
        ) {
            updateActiveSection(initialId);
        }
    } else {
        const firstSection =
            document.querySelector("#home, #hero");

        if (firstSection) {
            updateActiveSection(
                firstSection.id
            );
        }
    }

    /* =====================================================
       16. INITIAL MOBILE MENU STATE
       ===================================================== */

    closeMenu();

    handleBreakpointChange();

    /* =====================================================
       17. INITIALIZATION COMPLETE
       ===================================================== */

    console.log(
        "Golden Legacy: Navigation initialized successfully."
    );
});