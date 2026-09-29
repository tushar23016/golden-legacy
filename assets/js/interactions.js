
/* =========================================================
   GOLDEN LEGACY — INTERACTIONS
   File: assets/js/interactions.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ---------------------------------------------------------
     1. BUTTON INTERACTION EFFECTS
  --------------------------------------------------------- */

  const buttons = document.querySelectorAll(
    "button, .btn, .button, [data-interaction]"
  );

  buttons.forEach((button) => {
    button.addEventListener("pointerdown", () => {
      button.classList.add("is-pressed");
    });

    const releaseButton = () => {
      button.classList.remove("is-pressed");
    };

    button.addEventListener(
      "pointerup",
      releaseButton
    );

    button.addEventListener(
      "pointerleave",
      releaseButton
    );

    button.addEventListener(
      "pointercancel",
      releaseButton
    );
  });

  /* ---------------------------------------------------------
     2. SMOOTH SCROLLING
  --------------------------------------------------------- */

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId) return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      const navbar = document.querySelector(
        ".navbar, .site-header"
      );

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });

      if (history.replaceState) {
        history.replaceState(
          null,
          "",
          targetId
        );
      }
    });
  });

  /* ---------------------------------------------------------
     3. BACK TO TOP
  --------------------------------------------------------- */

  const backToTop = document.querySelector(
    ".back-to-top, [data-back-to-top]"
  );

  if (backToTop) {
    function updateBackToTop() {
      const shouldShow = window.scrollY > 400;

      backToTop.classList.toggle(
        "visible",
        shouldShow
      );

      backToTop.setAttribute(
        "aria-hidden",
        String(!shouldShow)
      );

      if ("disabled" in backToTop) {
        backToTop.disabled = !shouldShow;
      }
    }

    window.addEventListener(
      "scroll",
      updateBackToTop,
      { passive: true }
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });

    updateBackToTop();
  }

  /* ---------------------------------------------------------
     4. EXPANDABLE CONTENT
  --------------------------------------------------------- */

  const expandButtons = document.querySelectorAll(
    "[data-expand-target]"
  );

  expandButtons.forEach((button) => {
    const targetSelector =
      button.dataset.expandTarget;

    let target;

    try {
      target = document.querySelector(
        targetSelector
      );
    } catch {
      return;
    }

    if (!target) return;

    button.setAttribute(
      "aria-expanded",
      String(!target.hidden)
    );

    button.addEventListener("click", () => {
      const isExpanded =
        button.getAttribute("aria-expanded") ===
        "true";

      target.hidden = isExpanded;

      button.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      button.classList.toggle(
        "expanded",
        !isExpanded
      );
    });
  });

  /* ---------------------------------------------------------
     5. COPY TO CLIPBOARD
  --------------------------------------------------------- */

  const copyButtons = document.querySelectorAll(
    "[data-copy]"
  );

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const textToCopy = button.dataset.copy;

      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(
          textToCopy
        );

        showCopyFeedback(button, "Copied!");

      } catch (error) {
        console.error(
          "Clipboard access failed:",
          error
        );

        showCopyFeedback(
          button,
          "Copy unavailable"
        );
      }
    });
  });

  function showCopyFeedback(button, message) {
    const originalText =
      button.dataset.originalText ||
      button.textContent.trim();

    button.dataset.originalText = originalText;

    button.textContent = message;

    button.classList.add("copy-success");

    window.setTimeout(() => {
      button.textContent = originalText;

      button.classList.remove(
        "copy-success"
      );
    }, 1600);
  }

  /* ---------------------------------------------------------
     6. TOOLTIPS
  --------------------------------------------------------- */

  const tooltipElements = document.querySelectorAll(
    "[data-tooltip]"
  );

  tooltipElements.forEach((element) => {
    const tooltipText =
      element.dataset.tooltip;

    if (!tooltipText) return;

    element.setAttribute(
      "aria-label",
      element.getAttribute("aria-label") ||
      tooltipText
    );

    element.addEventListener(
      "mouseenter",
      () => {
        element.classList.add(
          "tooltip-visible"
        );
      }
    );

    element.addEventListener(
      "mouseleave",
      () => {
        element.classList.remove(
          "tooltip-visible"
        );
      }
    );

    element.addEventListener(
      "focus",
      () => {
        element.classList.add(
          "tooltip-visible"
        );
      }
    );

    element.addEventListener(
      "blur",
      () => {
        element.classList.remove(
          "tooltip-visible"
        );
      }
    );
  });

  /* ---------------------------------------------------------
     7. ACCORDION
  --------------------------------------------------------- */

  const accordionItems = document.querySelectorAll(
    ".accordion-item"
  );

  accordionItems.forEach((item) => {
    const trigger = item.querySelector(
      ".accordion-trigger"
    );

    const content = item.querySelector(
      ".accordion-content"
    );

    if (!trigger || !content) return;

    trigger.setAttribute(
      "aria-expanded",
      String(item.classList.contains("active"))
    );

    trigger.addEventListener("click", () => {
      const isActive =
        item.classList.contains("active");

      const accordion = item.closest(
        ".accordion"
      );

      if (accordion) {
        accordion
          .querySelectorAll(".accordion-item")
          .forEach((otherItem) => {
            if (otherItem === item) return;

            otherItem.classList.remove("active");

            const otherTrigger =
              otherItem.querySelector(
                ".accordion-trigger"
              );

            const otherContent =
              otherItem.querySelector(
                ".accordion-content"
              );

            if (otherTrigger) {
              otherTrigger.setAttribute(
                "aria-expanded",
                "false"
              );
            }

            if (otherContent) {
              otherContent.hidden = true;
            }
          });
      }

      item.classList.toggle(
        "active",
        !isActive
      );

      trigger.setAttribute(
        "aria-expanded",
        String(!isActive)
      );

      content.hidden = isActive;
    });
  });

  /* ---------------------------------------------------------
     8. IMAGE TILT EFFECT
  --------------------------------------------------------- */

  const tiltElements = document.querySelectorAll(
    "[data-tilt]"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    tiltElements.forEach((element) => {
      element.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType !== "mouse") {
            return;
          }

          const rect =
            element.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
            rect.width;

          const y =
            (event.clientY - rect.top) /
            rect.height;

          const rotateX = (0.5 - y) * 8;
          const rotateY = (x - 0.5) * 8;

          element.style.setProperty(
            "--tilt-x",
            `${rotateX}deg`
          );

          element.style.setProperty(
            "--tilt-y",
            `${rotateY}deg`
          );

          element.classList.add(
            "tilt-active"
          );
        }
      );

      element.addEventListener(
        "pointerleave",
        () => {
          element.style.setProperty(
            "--tilt-x",
            "0deg"
          );

          element.style.setProperty(
            "--tilt-y",
            "0deg"
          );

          element.classList.remove(
            "tilt-active"
          );
        }
      );
    });
  }

  /* ---------------------------------------------------------
     9. CURRENT YEAR
  --------------------------------------------------------- */

  const yearElements = document.querySelectorAll(
    "[data-current-year]"
  );

  yearElements.forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });

  /* ---------------------------------------------------------
     10. INITIALIZE
  --------------------------------------------------------- */

  console.log(
    "Golden Legacy Interactions initialized."
  );
});