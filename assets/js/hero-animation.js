
/* =========================================================
   GOLDEN LEGACY — HERO ANIMATION ENGINE
   File: assets/js/hero-animation.js

   Features:
   - Cinematic hero entrance
   - Staggered title and subtitle reveal
   - Gold text animation support
   - Subtle 3D mouse parallax
   - Scroll-based hero fade and movement
   - Reduced-motion accessibility
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* =====================================================
       1. SELECT HERO ELEMENTS
       ===================================================== */

    const hero = document.querySelector(
        ".hero, .hero-section, .page-hero, .home-hero"
    );

    if (!hero) {
        return;
    }

    const heroContent = hero.querySelector(".hero-content");

    const heroTitle = hero.querySelector(".hero-title");

    const heroDescription = hero.querySelector(
        ".hero-description"
    );

    const heroEyebrow = hero.querySelector(
        ".section-eyebrow, .hero-eyebrow"
    );

    const heroActions = hero.querySelector(
        ".hero-actions"
    );

    const heroBackground = hero.querySelector(
        ".hero-background, .hero-bg, .hero-image"
    );


    /* =====================================================
       2. ACCESSIBILITY SETTINGS
       ===================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {

        hero.classList.add("hero-animation-complete");

        return;

    }


    /* =====================================================
       3. INITIALIZE HERO ENTRANCE
       ===================================================== */

    function initializeHero() {

        hero.classList.add("hero-animation-ready");

        // Reveal eyebrow

        if (heroEyebrow) {

            heroEyebrow.classList.add("hero-element-reveal");

            heroEyebrow.style.setProperty(
                "--hero-delay",
                "0.2s"
            );

        }

        // Reveal main title

        if (heroTitle) {

            heroTitle.classList.add("hero-element-reveal");

            heroTitle.style.setProperty(
                "--hero-delay",
                "0.45s"
            );

        }

        // Reveal description

        if (heroDescription) {

            heroDescription.classList.add(
                "hero-element-reveal"
            );

            heroDescription.style.setProperty(
                "--hero-delay",
                "0.7s"
            );

        }

        // Reveal action buttons

        if (heroActions) {

            heroActions.classList.add(
                "hero-element-reveal"
            );

            heroActions.style.setProperty(
                "--hero-delay",
                "0.95s"
            );

        }

        // Reveal the complete hero content

        if (heroContent) {

            heroContent.classList.add(
                "hero-content-animated"
            );

        }

        hero.classList.add("hero-animation-complete");

    }


    /* =====================================================
       4. START HERO ANIMATION
       ===================================================== */

    if (document.readyState === "complete") {

        initializeHero();

    } else {

        window.addEventListener(
            "load",
            initializeHero,
            { once: true }
        );

        // Fallback for slow-loading images or resources

        setTimeout(() => {

            if (
                !hero.classList.contains(
                    "hero-animation-complete"
                )
            ) {

                initializeHero();

            }

        }, 1500);

    }


    /* =====================================================
       5. MOUSE-BASED 3D PARALLAX
       ===================================================== */

    const canUseParallax =
        window.matchMedia("(hover: hover)").matches &&
        window.innerWidth > 767;

    if (canUseParallax && heroContent) {

        const maxTilt = 3;

        hero.addEventListener("mousemove", (event) => {

            const rect = hero.getBoundingClientRect();

            const mouseX =
                (event.clientX - rect.left) / rect.width;

            const mouseY =
                (event.clientY - rect.top) / rect.height;

            const rotateY =
                (mouseX - 0.5) * maxTilt * 2;

            const rotateX =
                (0.5 - mouseY) * maxTilt * 2;

            heroContent.style.transform =
                `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });

        // Reset when pointer leaves the hero

        hero.addEventListener("mouseleave", () => {

            heroContent.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg)";

        });

    }


    /* =====================================================
       6. BACKGROUND PARALLAX ON SCROLL
       ===================================================== */

    let scrollTicking = false;

    function updateHeroScroll() {

        const heroRect = hero.getBoundingClientRect();

        const heroHeight = hero.offsetHeight;

        // Stop when the hero is outside the viewport

        if (
            heroRect.bottom <= 0 ||
            heroRect.top >= window.innerHeight
        ) {

            scrollTicking = false;

            return;

        }

        const scrollProgress = Math.max(
            0,
            Math.min(
                1,
                -heroRect.top / heroHeight
            )
        );

        // Move background subtly

        if (heroBackground) {

            const backgroundOffset =
                scrollProgress * 60;

            heroBackground.style.transform =
                `translate3d(0, ${backgroundOffset}px, 0) scale(1.05)`;

        }

        // Fade hero content as user scrolls

        if (heroContent) {

            const opacity = Math.max(
                0,
                1 - scrollProgress * 1.5
            );

            heroContent.style.opacity = opacity;

        }

        scrollTicking = false;

    }


    window.addEventListener("scroll", () => {

        if (!scrollTicking) {

            window.requestAnimationFrame(
                updateHeroScroll
            );

            scrollTicking = true;

        }

    }, { passive: true });


    /* =====================================================
       7. CLEAN UP ON RESIZE
       ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth <= 767 && heroContent) {

            heroContent.style.transform = "";

        }

    }, { passive: true });


    console.log(
        "Golden Legacy hero animation initialized."
    );

});