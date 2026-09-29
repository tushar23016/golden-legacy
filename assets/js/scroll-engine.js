
/* =========================================================
   GOLDEN LEGACY — SCROLL ENGINE
   File: assets/js/scroll-engine.js

   Features:
   - Scroll reveal animations
   - Intersection Observer
   - Page scroll progress indicator
   - Active section tracking
   - Timeline reveal effects
   - Reduced-motion accessibility
   - Performance optimization
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       1. ACCESSIBILITY SETTINGS
       ===================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       2. SCROLL REVEAL ELEMENTS
       ===================================================== */

    const revealSelectors = [
        ".reveal",
        ".reveal-up",
        ".reveal-left",
        ".reveal-right",
        ".memory-card",
        ".gallery-item",
        ".video-card",
        ".member-card",
        ".timeline-item"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(", ")
    );


    /* =====================================================
       3. INITIALIZE REVEAL ANIMATIONS
       ===================================================== */

    if (prefersReducedMotion) {

        revealElements.forEach((element) => {

            element.classList.add("is-visible");

        });

    } else if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "is-visible"
                        );

                        // Stop observing after reveal

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                root: null,
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        // Fallback for older browsers

        revealElements.forEach((element) => {

            element.classList.add("is-visible");

        });

    }


    /* =====================================================
       4. PAGE SCROLL PROGRESS INDICATOR
       ===================================================== */

    let progressBar = document.querySelector(
        ".scroll-progress"
    );

    // Create the progress bar if it does not exist

    if (!progressBar) {

        progressBar = document.createElement("div");

        progressBar.className = "scroll-progress";

        progressBar.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.prepend(progressBar);

    }


    // Set basic styles through JavaScript

    Object.assign(progressBar.style, {

        position: "fixed",
        top: "0",
        left: "0",
        width: "0%",
        height: "3px",
        zIndex: "99999",
        background:
            "linear-gradient(90deg, #b8860b, #d4af37, #f9e29c)",
        transformOrigin: "left center",
        pointerEvents: "none",
        transition: "width 0.08s linear"

    });


    /* =====================================================
       5. UPDATE SCROLL PROGRESS
       ===================================================== */

    let scrollScheduled = false;

    function updateScrollProgress() {

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        let progress = 0;

        if (scrollHeight > 0) {

            progress = (scrollTop / scrollHeight) * 100;

        }

        progress = Math.min(
            100,
            Math.max(0, progress)
        );

        progressBar.style.width = `${progress}%`;

        scrollScheduled = false;

    }


    function requestProgressUpdate() {

        if (!scrollScheduled) {

            window.requestAnimationFrame(
                updateScrollProgress
            );

            scrollScheduled = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestProgressUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestProgressUpdate,
        { passive: true }
    );

    // Initial update

    updateScrollProgress();


    /* =====================================================
       6. ACTIVE SECTION TRACKING
       ===================================================== */

    const sections = document.querySelectorAll(
        "main section[id], section[id]"
    );

    const sectionNavigationLinks =
        document.querySelectorAll(
            '.nav-links a[href*="#"], .nav-menu a[href*="#"]'
        );


    if (
        sections.length > 0 &&
        sectionNavigationLinks.length > 0 &&
        "IntersectionObserver" in window
    ) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        const activeSectionId =
                            entry.target.getAttribute("id");

                        sectionNavigationLinks.forEach(
                            (link) => {

                                const linkUrl = new URL(
                                    link.href,
                                    window.location.href
                                );

                                const linkSectionId =
                                    linkUrl.hash.substring(1);

                                if (
                                    linkSectionId ===
                                    activeSectionId
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                    link.setAttribute(
                                        "aria-current",
                                        "location"
                                    );

                                } else {

                                    link.classList.remove(
                                        "active"
                                    );

                                    link.removeAttribute(
                                        "aria-current"
                                    );

                                }

                            }
                        );

                    }

                });

            },
            {
                root: null,
                threshold: 0,
                rootMargin: "-25% 0px -65% 0px"
            }
        );


        sections.forEach((section) => {

            sectionObserver.observe(section);

        });

    }


    /* =====================================================
       7. TIMELINE SCROLL REVEAL
       ===================================================== */

    const timelineItems = document.querySelectorAll(
        ".timeline-item"
    );

    if (
        timelineItems.length > 0 &&
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        const timelineObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.15,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        timelineItems.forEach((item, index) => {

            item.style.setProperty(
                "--timeline-index",
                index
            );

            timelineObserver.observe(item);

        });

    }


    /* =====================================================
       8. BACK TO TOP BUTTON
       ===================================================== */

    const backToTop = document.querySelector(
        ".back-to-top, #backToTop"
    );

    if (backToTop) {

        function updateBackToTop() {

            if (window.scrollY > 400) {

                backToTop.classList.add("visible");

                backToTop.setAttribute(
                    "aria-hidden",
                    "false"
                );

            } else {

                backToTop.classList.remove("visible");

                backToTop.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }


        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        updateBackToTop();


        backToTop.addEventListener("click", (event) => {

            event.preventDefault();

            window.scrollTo({

                top: 0,

                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"

            });

        });

    }


    /* =====================================================
       9. INITIALIZE
       ===================================================== */

    console.log(
        "Golden Legacy scroll engine initialized."
    );

});