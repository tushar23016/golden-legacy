
/* =========================================================
   GOLDEN LEGACY — TIMELINE ENGINE
   File: assets/js/timeline.js

   Features:
   - Chronological timeline
   - Timeline scroll reveal
   - Year-based filtering
   - Timeline navigation
   - Active timeline item tracking
   - Reduced-motion accessibility
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       1. CONFIGURATION
       ===================================================== */

    const CONFIG = {
        timelineSelector: ".timeline",
        itemSelector: ".timeline-item",
        filterSelector: ".timeline-filter",
        yearSelector: ".timeline-year",

        revealThreshold: 0.15,

        animationDuration: 700
    };


    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       2. SELECT TIMELINE ELEMENTS
       ===================================================== */

    const timelines = document.querySelectorAll(
        CONFIG.timelineSelector
    );

    if (timelines.length === 0) {
        return;
    }


    /* =====================================================
       3. INITIALIZE EACH TIMELINE
       ===================================================== */

    timelines.forEach((timeline) => {

        const timelineItems = Array.from(
            timeline.querySelectorAll(
                CONFIG.itemSelector
            )
        );

        if (timelineItems.length === 0) {
            return;
        }


        /* =================================================
           4. TIMELINE ITEM PREPARATION
           ================================================= */

        timelineItems.forEach((item, index) => {

            item.dataset.timelineIndex = index;

            item.setAttribute(
                "data-timeline-visible",
                "false"
            );

            if (prefersReducedMotion) {

                item.classList.add("is-visible");

                item.setAttribute(
                    "data-timeline-visible",
                    "true"
                );

            }

        });


        /* =================================================
           5. SCROLL REVEAL
           ================================================= */

        if (
            !prefersReducedMotion &&
            "IntersectionObserver" in window
        ) {

            const timelineObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (entry.isIntersecting) {

                                const item = entry.target;

                                item.classList.add(
                                    "is-visible"
                                );

                                item.setAttribute(
                                    "data-timeline-visible",
                                    "true"
                                );

                                observer.unobserve(item);

                            }

                        });

                    },
                    {
                        threshold:
                            CONFIG.revealThreshold,

                        rootMargin:
                            "0px 0px -40px 0px"
                    }
                );


            timelineItems.forEach((item, index) => {

                item.style.setProperty(
                    "--timeline-index",
                    index
                );

                timelineObserver.observe(item);

            });

        } else {

            timelineItems.forEach((item) => {

                item.classList.add("is-visible");

            });

        }


        /* =================================================
           6. CHRONOLOGICAL SORTING
           ================================================= */

        const sortButton = timeline.querySelector(
            ".timeline-sort"
        );

        let chronological = true;


        function getTimelineDate(item) {

            const dateElement = item.querySelector(
                "time[datetime], .timeline-date"
            );

            if (!dateElement) {
                return null;
            }

            const dateValue =
                dateElement.getAttribute("datetime") ||
                dateElement.textContent.trim();

            const timestamp = Date.parse(dateValue);

            return Number.isNaN(timestamp)
                ? null
                : timestamp;

        }


        function sortTimeline() {

            chronological = !chronological;

            const sortedItems = [...timelineItems].sort(
                (a, b) => {

                    const dateA = getTimelineDate(a);

                    const dateB = getTimelineDate(b);

                    if (dateA === null && dateB === null) {
                        return 0;
                    }

                    if (dateA === null) {
                        return 1;
                    }

                    if (dateB === null) {
                        return -1;
                    }

                    return chronological
                        ? dateA - dateB
                        : dateB - dateA;

                }
            );


            sortedItems.forEach((item) => {

                timeline.appendChild(item);

            });


            if (sortButton) {

                sortButton.textContent =
                    chronological
                        ? "Oldest First"
                        : "Newest First";

                sortButton.setAttribute(
                    "aria-label",
                    chronological
                        ? "Timeline sorted oldest first"
                        : "Timeline sorted newest first"
                );

            }

        }


        if (sortButton) {

            sortButton.addEventListener(
                "click",
                sortTimeline
            );

        }


        /* =================================================
           7. YEAR-BASED FILTERING
           ================================================= */

        const filterButtons = timeline.querySelectorAll(
            CONFIG.filterSelector
        );


        function getItemYear(item) {

            const dateElement = item.querySelector(
                "time[datetime], .timeline-date"
            );

            if (!dateElement) {
                return null;
            }

            const dateValue =
                dateElement.getAttribute("datetime") ||
                dateElement.textContent.trim();

            const match = dateValue.match(
                /\b(19|20)\d{2}\b/
            );

            return match ? match[0] : null;

        }


        function filterTimeline(year) {

            timelineItems.forEach((item) => {

                const itemYear = getItemYear(item);

                const shouldShow =
                    year === "all" ||
                    itemYear === year;

                item.hidden = !shouldShow;

                if (shouldShow) {

                    item.classList.add("is-visible");

                    item.setAttribute(
                        "data-timeline-visible",
                        "true"
                    );

                }

            });

        }


        filterButtons.forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const selectedYear =
                        button.dataset.year || "all";

                    filterButtons.forEach((filter) => {

                        filter.classList.remove("active");

                        filter.setAttribute(
                            "aria-pressed",
                            "false"
                        );

                    });

                    button.classList.add("active");

                    button.setAttribute(
                        "aria-pressed",
                        "true"
                    );

                    filterTimeline(selectedYear);

                }
            );

        });


        /* =================================================
           8. YEAR NAVIGATION
           ================================================= */

        const yearLinks = timeline.querySelectorAll(
            CONFIG.yearSelector
        );


        yearLinks.forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetYear =
                        link.dataset.year;

                    if (!targetYear) {
                        return;
                    }

                    const targetItem =
                        timelineItems.find((item) => {

                            return getItemYear(item) ===
                                targetYear;

                        });

                    if (!targetItem) {
                        return;
                    }

                    event.preventDefault();

                    targetItem.scrollIntoView({

                        behavior: prefersReducedMotion
                            ? "auto"
                            : "smooth",

                        block: "center"

                    });

                }
            );

        });


        /* =================================================
           9. TIMELINE ITEM CLICK
           ================================================= */

        timelineItems.forEach((item) => {

            item.addEventListener(
                "click",
                (event) => {

                    // Ignore clicks on links and buttons

                    if (
                        event.target.closest(
                            "a, button"
                        )
                    ) {
                        return;
                    }

                    timelineItems.forEach((otherItem) => {

                        otherItem.classList.remove(
                            "timeline-item-active"
                        );

                    });

                    item.classList.add(
                        "timeline-item-active"
                    );

                }
            );

        });


        /* =================================================
           10. INITIALIZE FILTER STATE
           ================================================= */

        const allFilter = Array.from(
            filterButtons
        ).find((button) => {

            return (
                button.dataset.year === "all" ||
                !button.dataset.year
            );

        });


        if (allFilter) {

            allFilter.classList.add("active");

            allFilter.setAttribute(
                "aria-pressed",
                "true"
            );

        }

    });


    /* =====================================================
       11. GLOBAL TIMELINE NAVIGATION
       ===================================================== */

    const timelineNavigationButtons =
        document.querySelectorAll(
            "[data-timeline-next], [data-timeline-prev]"
        );


    timelineNavigationButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const timeline =
                    button.closest(".timeline");

                if (!timeline) {
                    return;
                }

                const visibleItems = Array.from(
                    timeline.querySelectorAll(
                        ".timeline-item:not([hidden])"
                    )
                );

                if (visibleItems.length === 0) {
                    return;
                }

                const activeIndex =
                    visibleItems.findIndex((item) => {

                        return item.classList.contains(
                            "timeline-item-active"
                        );

                    });

                let nextIndex;

                if (button.hasAttribute(
                    "data-timeline-next"
                )) {

                    nextIndex =
                        (activeIndex + 1) %
                        visibleItems.length;

                } else {

                    nextIndex =
                        (
                            activeIndex -
                            1 +
                            visibleItems.length
                        ) % visibleItems.length;

                }

                visibleItems.forEach((item) => {

                    item.classList.remove(
                        "timeline-item-active"
                    );

                });

                const nextItem =
                    visibleItems[nextIndex];

                nextItem.classList.add(
                    "timeline-item-active"
                );

                nextItem.scrollIntoView({

                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",

                    block: "center"

                });

            }
        );

    });


    /* =====================================================
       12. INITIALIZE
       ===================================================== */

    console.log(
        "Golden Legacy timeline engine initialized."
    );

});