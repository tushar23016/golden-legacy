
/* =========================================================
   GOLDEN LEGACY — PARALLAX ENGINE
   File: assets/js/parallax.js

   Features:
   - Scroll-based parallax
   - Mouse-based 3D movement
   - Background depth effects
   - Gold decorative element movement
   - Responsive performance optimization
   - Reduced-motion accessibility
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       1. CONFIGURATION
       ===================================================== */

    const CONFIG = {
        scrollSpeed: 0.15,
        mouseIntensity: 12,
        mobileBreakpoint: 767,
        maxScrollMovement: 100
    };


    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const isTouchDevice = window.matchMedia(
        "(hover: none) and (pointer: coarse)"
    ).matches;


    // Stop parallax effects when reduced motion is enabled

    if (prefersReducedMotion) {
        return;
    }


    /* =====================================================
       2. SELECT PARALLAX ELEMENTS
       ===================================================== */

    const parallaxElements = document.querySelectorAll(
        "[data-parallax]"
    );

    const parallaxBackgrounds = document.querySelectorAll(
        "[data-parallax-bg]"
    );

    const mouseParallaxElements = document.querySelectorAll(
        "[data-mouse-parallax]"
    );


    /* =====================================================
       3. SCROLL PARALLAX
       ===================================================== */

    let scrollFrameRequested = false;

    function updateScrollParallax() {

        const viewportHeight = window.innerHeight;

        parallaxElements.forEach((element) => {

            const rect = element.getBoundingClientRect();

            // Skip elements outside the viewport

            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }

            const speed = parseFloat(
                element.dataset.parallax
            ) || CONFIG.scrollSpeed;

            // Calculate movement based on element position

            const elementCenter =
                rect.top + rect.height / 2;

            const distanceFromCenter =
                elementCenter - viewportHeight / 2;

            let movement =
                distanceFromCenter * speed;

            // Prevent excessive movement

            movement = Math.max(
                -CONFIG.maxScrollMovement,
                Math.min(
                    CONFIG.maxScrollMovement,
                    movement
                )
            );

            element.style.setProperty(
                "--parallax-y",
                `${movement}px`
            );

        });


        // Background parallax

        parallaxBackgrounds.forEach((element) => {

            const rect = element.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }

            const speed = parseFloat(
                element.dataset.parallaxBg
            ) || 0.1;

            const movement =
                rect.top * speed;

            element.style.setProperty(
                "--parallax-bg-y",
                `${movement}px`
            );

        });

        scrollFrameRequested = false;

    }


    function requestScrollUpdate() {

        if (!scrollFrameRequested) {

            window.requestAnimationFrame(
                updateScrollParallax
            );

            scrollFrameRequested = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestScrollUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestScrollUpdate,
        { passive: true }
    );


    /* =====================================================
       4. MOUSE-BASED PARALLAX
       ===================================================== */

    const canUseMouseParallax =
        !isTouchDevice &&
        window.innerWidth > CONFIG.mobileBreakpoint;


    if (
        canUseMouseParallax &&
        mouseParallaxElements.length > 0
    ) {

        const heroSections = document.querySelectorAll(
            ".hero, .hero-section, .page-hero, .home-hero"
        );


        heroSections.forEach((hero) => {

            let mouseFrameRequested = false;

            let mouseX = 0;
            let mouseY = 0;

            function updateMouseParallax() {

                mouseParallaxElements.forEach((element) => {

                    // Only affect elements inside this hero

                    if (!hero.contains(element)) {
                        return;
                    }

                    const depth = parseFloat(
                        element.dataset.mouseParallax
                    ) || 1;

                    const moveX =
                        mouseX *
                        CONFIG.mouseIntensity *
                        depth;

                    const moveY =
                        mouseY *
                        CONFIG.mouseIntensity *
                        depth;

                    element.style.setProperty(
                        "--mouse-parallax-x",
                        `${moveX}px`
                    );

                    element.style.setProperty(
                        "--mouse-parallax-y",
                        `${moveY}px`
                    );

                });

                mouseFrameRequested = false;

            }


            hero.addEventListener(
                "mousemove",
                (event) => {

                    const rect =
                        hero.getBoundingClientRect();

                    mouseX =
                        (event.clientX - rect.left) /
                        rect.width - 0.5;

                    mouseY =
                        (event.clientY - rect.top) /
                        rect.height - 0.5;

                    if (!mouseFrameRequested) {

                        window.requestAnimationFrame(() => {

                            updateMouseParallax();

                        });

                        mouseFrameRequested = true;

                    }

                }
            );


            // Reset elements when the pointer leaves

            hero.addEventListener(
                "mouseleave",
                () => {

                    mouseX = 0;
                    mouseY = 0;

                    if (!mouseFrameRequested) {

                        window.requestAnimationFrame(() => {

                            updateMouseParallax();

                        });

                        mouseFrameRequested = true;

                    }

                }
            );

        });

    }


    /* =====================================================
       5. MOBILE OPTIMIZATION
       ===================================================== */

    function handleResponsiveParallax() {

        if (
            window.innerWidth <=
            CONFIG.mobileBreakpoint
        ) {

            // Disable mouse movement on smaller screens

            mouseParallaxElements.forEach((element) => {

                element.style.removeProperty(
                    "--mouse-parallax-x"
                );

                element.style.removeProperty(
                    "--mouse-parallax-y"
                );

            });

        }

        requestScrollUpdate();

    }


    window.addEventListener(
        "resize",
        handleResponsiveParallax,
        { passive: true }
    );


    /* =====================================================
       6. INITIALIZE
       ===================================================== */

    updateScrollParallax();

    console.log(
        "Golden Legacy parallax engine initialized."
    );

});