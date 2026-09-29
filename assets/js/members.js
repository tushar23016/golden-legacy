
/* =========================================================
   GOLDEN LEGACY — MEMBERS ENGINE
   File: assets/js/members.js

   Features:
   - Six-member cinematic sequence
   - Z-axis approach and retreat
   - Member navigation controls
   - Member profile information
   - Keyboard navigation
   - Reduced-motion accessibility
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       1. CONFIGURATION
       ===================================================== */

    const CONFIG = {
        totalMembers: 6,

        animationDuration: 1800,

        transitionDelay: 400,

        cameraStartZ: 600,

        cameraEndZ: -1200,

        mobileBreakpoint: 767
    };


    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       2. MEMBER DATA
       Replace names and descriptions with your real content.
       ===================================================== */

    const members = [
        {
            id: 1,
            name: "Member 01",
            role: "The Beginning",
            description:
                "Every great legacy begins with a story."
        },
        {
            id: 2,
            name: "Member 02",
            role: "The Vision",
            description:
                "Different paths, one shared journey."
        },
        {
            id: 3,
            name: "Member 03",
            role: "The Bond",
            description:
                "Memories that bring us closer."
        },
        {
            id: 4,
            name: "Member 04",
            role: "The Strength",
            description:
                "Together through every chapter."
        },
        {
            id: 5,
            name: "Member 05",
            role: "The Journey",
            description:
                "Every moment becomes part of our story."
        },
        {
            id: 6,
            name: "Member 06",
            role: "The Legacy",
            description:
                "Six individuals. One golden legacy."
        }
    ];


    /* =====================================================
       3. SELECT ELEMENTS
       ===================================================== */

    const stage = document.querySelector(
        ".members-3d-stage"
    );

    const world = document.querySelector(
        ".members-3d-world"
    );

    const memberElements = document.querySelectorAll(
        ".member-3d"
    );

    const nextButton = document.querySelector(
        ".member-next, .next-member"
    );

    const previousButton = document.querySelector(
        ".member-prev, .prev-member"
    );

    const counter = document.querySelector(
        ".member-counter"
    );

    const memberName = document.querySelector(
        ".member-name"
    );

    const memberRole = document.querySelector(
        ".member-role"
    );

    const memberDescription = document.querySelector(
        ".member-description"
    );


    // Do not initialize if the members section is absent

    if (!stage || !world || memberElements.length === 0) {
        return;
    }


    /* =====================================================
       4. STATE
       ===================================================== */

    let currentIndex = 0;

    let isAnimating = false;

    let animationTimeout = null;

    const totalMembers = Math.min(
        CONFIG.totalMembers,
        memberElements.length,
        members.length
    );


    /* =====================================================
       5. PREPARE MEMBER ELEMENTS
       ===================================================== */

    memberElements.forEach((element, index) => {

        element.style.position = "absolute";

        element.style.left = "50%";

        element.style.top = "50%";

        element.style.transform =
            "translate3d(-50%, -50%, 0)";

        element.style.transformStyle = "preserve-3d";

        element.style.willChange = "transform, opacity";

        element.style.opacity = "0";

        element.style.pointerEvents = "none";

        element.classList.remove(
            "is-entering",
            "is-exiting",
            "active"
        );

        element.setAttribute(
            "aria-hidden",
            "true"
        );

        element.dataset.memberIndex = index;

    });


    /* =====================================================
       6. MEMBER INFORMATION
       ===================================================== */

    function updateMemberInformation(index) {

        const member = members[index];

        if (!member) {
            return;
        }

        if (counter) {

            counter.textContent =
                `${String(index + 1).padStart(2, "0")} / ` +
                `${String(totalMembers).padStart(2, "0")}`;

        }

        if (memberName) {

            memberName.textContent = member.name;

        }

        if (memberRole) {

            memberRole.textContent = member.role;

        }

        if (memberDescription) {

            memberDescription.textContent =
                member.description;

        }

    }


    /* =====================================================
       7. POSITION MEMBER AT CAMERA DISTANCE
       ===================================================== */

    function setMemberPosition(element, z, opacity) {

        element.style.transform =
            `translate3d(-50%, -50%, ${z}px)`;

        element.style.opacity = opacity;

    }


    /* =====================================================
       8. SHOW INITIAL MEMBER
       ===================================================== */

    function showInitialMember() {

        const firstMember = memberElements[0];

        if (!firstMember) {
            return;
        }

        firstMember.classList.add("active");

        firstMember.style.transition = "none";

        firstMember.style.opacity = "1";

        firstMember.style.pointerEvents = "auto";

        firstMember.setAttribute(
            "aria-hidden",
            "false"
        );

        setMemberPosition(
            firstMember,
            CONFIG.cameraStartZ,
            1
        );

        updateMemberInformation(0);

    }


    /* =====================================================
       9. CINEMATIC MEMBER TRANSITION
       ===================================================== */

    function transitionToMember(nextIndex) {

        if (isAnimating) {
            return;
        }

        if (
            nextIndex < 0 ||
            nextIndex >= totalMembers ||
            nextIndex === currentIndex
        ) {
            return;
        }

        const currentMember =
            memberElements[currentIndex];

        const nextMember =
            memberElements[nextIndex];

        if (!currentMember || !nextMember) {
            return;
        }

        isAnimating = true;

        clearTimeout(animationTimeout);


        // Update accessibility and navigation state

        currentMember.setAttribute(
            "aria-hidden",
            "true"
        );

        nextMember.setAttribute(
            "aria-hidden",
            "false"
        );

        currentMember.style.pointerEvents = "none";

        nextMember.style.pointerEvents = "auto";


        /* ================================================
           REDUCED MOTION
           ================================================ */

        if (prefersReducedMotion) {

            currentMember.classList.remove("active");

            currentMember.style.opacity = "0";

            nextMember.classList.add("active");

            nextMember.style.opacity = "1";

            setMemberPosition(
                nextMember,
                0,
                1
            );

            currentIndex = nextIndex;

            updateMemberInformation(currentIndex);

            isAnimating = false;

            return;

        }


        /* ================================================
           PHASE 1 — CURRENT MEMBER MOVES AWAY
           ================================================ */

        currentMember.classList.remove("active");

        currentMember.classList.add("is-exiting");

        currentMember.style.transition =
            `transform ${CONFIG.animationDuration}ms ` +
            "cubic-bezier(0.65, 0, 0.35, 1), " +
            `opacity ${CONFIG.animationDuration}ms ease`;

        currentMember.style.transform =
            `translate3d(-50%, -50%, ${CONFIG.cameraEndZ}px)`;

        currentMember.style.opacity = "0";


        /* ================================================
           PHASE 2 — NEXT MEMBER ENTERS
           ================================================ */

        nextMember.style.transition = "none";

        nextMember.classList.remove("is-exiting");

        nextMember.classList.add("is-entering");

        setMemberPosition(
            nextMember,
            CONFIG.cameraStartZ,
            0
        );

        // Force browser to apply the starting position

        void nextMember.offsetWidth;


        // Animate next member toward the camera

        nextMember.style.transition =
            `transform ${CONFIG.animationDuration}ms ` +
            "cubic-bezier(0.22, 1, 0.36, 1), " +
            `opacity ${CONFIG.animationDuration}ms ease`;

        nextMember.style.transform =
            "translate3d(-50%, -50%, 0px)";

        nextMember.style.opacity = "1";

        nextMember.classList.add("active");


        /* ================================================
           PHASE 3 — UPDATE MEMBER DATA
           ================================================ */

        currentIndex = nextIndex;

        updateMemberInformation(currentIndex);


        /* ================================================
           PHASE 4 — CLEANUP
           ================================================ */

        animationTimeout = setTimeout(() => {

            currentMember.classList.remove(
                "is-exiting",
                "is-entering"
            );

            nextMember.classList.remove(
                "is-entering"
            );

            currentMember.style.transition = "none";

            currentMember.style.opacity = "0";

            setMemberPosition(
                currentMember,
                CONFIG.cameraEndZ,
                0
            );

            isAnimating = false;

        }, CONFIG.animationDuration + CONFIG.transitionDelay);

    }


    /* =====================================================
       10. NEXT MEMBER
       ===================================================== */

    function nextMember() {

        const nextIndex =
            (currentIndex + 1) % totalMembers;

        transitionToMember(nextIndex);

    }


    /* =====================================================
       11. PREVIOUS MEMBER
       ===================================================== */

    function previousMember() {

        const previousIndex =
            (currentIndex - 1 + totalMembers) %
            totalMembers;

        transitionToMember(previousIndex);

    }


    /* =====================================================
       12. BUTTON EVENTS
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextMember
        );

    }

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousMember
        );

    }


    /* =====================================================
       13. KEYBOARD NAVIGATION
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            // Avoid triggering when typing in form fields

            const target = event.target;

            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement ||
                target.isContentEditable
            ) {
                return;
            }

            if (!stage.contains(target) &&
                !stage.contains(document.activeElement)) {
                return;
            }

            if (event.key === "ArrowRight") {

                event.preventDefault();

                nextMember();

            }

            if (event.key === "ArrowLeft") {

                event.preventDefault();

                previousMember();

            }

        }
    );


    /* =====================================================
       14. TOUCH SWIPE SUPPORT
       ===================================================== */

    let touchStartX = 0;

    let touchEndX = 0;

    stage.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    stage.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;

            const swipeDistance =
                touchEndX - touchStartX;

            if (Math.abs(swipeDistance) < 60) {
                return;
            }

            if (swipeDistance < 0) {

                nextMember();

            } else {

                previousMember();

            }

        },
        { passive: true }
    );


    /* =====================================================
       15. RESPONSIVE CAMERA ADJUSTMENT
       ===================================================== */

    function updateCamera() {

        if (
            window.innerWidth <=
            CONFIG.mobileBreakpoint
        ) {

            stage.style.perspective = "800px";

        } else {

            stage.style.perspective = "1200px";

        }

    }


    window.addEventListener(
        "resize",
        updateCamera,
        { passive: true }
    );


    /* =====================================================
       16. INITIALIZE MEMBERS ENGINE
       ===================================================== */

    updateCamera();

    showInitialMember();

    console.log(
        "Golden Legacy members engine initialized."
    );

});