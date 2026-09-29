
/* =========================================================
   GOLDEN LEGACY — LIGHTBOX SYSTEM
   File: assets/js/lightbox.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const galleryItems = Array.from(
    gallery.querySelectorAll(
      ".gallery-item, .gallery-card"
    )
  );

  if (galleryItems.length === 0) return;

  let currentIndex = 0;
  let visibleImages = [];
  let previousFocus = null;
  let isOpen = false;

  /* ---------------------------------------------------------
     1. CREATE LIGHTBOX ELEMENTS
  --------------------------------------------------------- */

  const lightbox = document.createElement("div");

  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Image viewer");
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>

    <div class="lightbox-container">

      <button
        class="lightbox-close"
        type="button"
        aria-label="Close image viewer">
        &times;
      </button>

      <button
        class="lightbox-prev"
        type="button"
        aria-label="Previous image">
        &#10094;
      </button>

      <div class="lightbox-content">

        <img
          class="lightbox-image"
          src=""
          alt="">

        <div class="lightbox-info">
          <p class="lightbox-caption"></p>
          <span class="lightbox-counter"></span>
        </div>

      </div>

      <button
        class="lightbox-next"
        type="button"
        aria-label="Next image">
        &#10095;
      </button>

    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(
    ".lightbox-image"
  );

  const caption = lightbox.querySelector(
    ".lightbox-caption"
  );

  const counter = lightbox.querySelector(
    ".lightbox-counter"
  );

  const closeButton = lightbox.querySelector(
    ".lightbox-close"
  );

  const prevButton = lightbox.querySelector(
    ".lightbox-prev"
  );

  const nextButton = lightbox.querySelector(
    ".lightbox-next"
  );

  const backdrop = lightbox.querySelector(
    ".lightbox-backdrop"
  );

  /* ---------------------------------------------------------
     2. GET VISIBLE GALLERY IMAGES
  --------------------------------------------------------- */

  function getVisibleImages() {
    return galleryItems.filter((item) => {
      return (
        !item.classList.contains(
          "gallery-item-hidden"
        ) &&
        item.getAttribute("aria-hidden") !== "true"
      );
    });
  }

  function getImageElement(item) {
    return item.querySelector("img");
  }

  function getImageCaption(item, image) {
    const captionElement = item.querySelector(
      ".gallery-title, .gallery-caption, figcaption"
    );

    return (
      image.dataset.caption ||
      item.dataset.name ||
      captionElement?.textContent.trim() ||
      image.alt ||
      "Golden Legacy Memory"
    );
  }

  /* ---------------------------------------------------------
     3. OPEN LIGHTBOX
  --------------------------------------------------------- */

  function openLightbox(index) {
    visibleImages = getVisibleImages();

    if (visibleImages.length === 0) return;

    currentIndex = Math.max(
      0,
      Math.min(index, visibleImages.length - 1)
    );

    previousFocus = document.activeElement;
    isOpen = true;

    lightbox.classList.add("lightbox-active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.classList.add("lightbox-open");

    showImage(currentIndex);

    closeButton.focus();
  }

  /* ---------------------------------------------------------
     4. DISPLAY IMAGE
  --------------------------------------------------------- */

  function showImage(index) {
    if (
      index < 0 ||
      index >= visibleImages.length
    ) {
      return;
    }

    currentIndex = index;

    const item = visibleImages[currentIndex];
    const image = getImageElement(item);

    if (!image) return;

    lightboxImage.classList.remove(
      "lightbox-image-loaded"
    );

    lightboxImage.src = image.currentSrc || image.src;

    lightboxImage.alt = image.alt || "Gallery image";

    caption.textContent = getImageCaption(
      item,
      image
    );

    counter.textContent =
      `${currentIndex + 1} / ${visibleImages.length}`;

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled =
      currentIndex === visibleImages.length - 1;

    lightboxImage.onload = () => {
      lightboxImage.classList.add(
        "lightbox-image-loaded"
      );
    };

    if (lightboxImage.complete) {
      lightboxImage.classList.add(
        "lightbox-image-loaded"
      );
    }

    updateNavigation();
  }

  /* ---------------------------------------------------------
     5. NEXT AND PREVIOUS
  --------------------------------------------------------- */

  function showNext() {
    if (currentIndex < visibleImages.length - 1) {
      showImage(currentIndex + 1);
    }
  }

  function showPrevious() {
    if (currentIndex > 0) {
      showImage(currentIndex - 1);
    }
  }

  nextButton.addEventListener("click", showNext);

  prevButton.addEventListener(
    "click",
    showPrevious
  );

  /* ---------------------------------------------------------
     6. UPDATE NAVIGATION BUTTONS
  --------------------------------------------------------- */

  function updateNavigation() {
    const singleImage = visibleImages.length <= 1;

    prevButton.hidden = singleImage;
    nextButton.hidden = singleImage;

    prevButton.disabled = currentIndex === 0;

    nextButton.disabled =
      currentIndex === visibleImages.length - 1;
  }

  /* ---------------------------------------------------------
     7. CLOSE LIGHTBOX
  --------------------------------------------------------- */

  function closeLightbox() {
    if (!isOpen) return;

    isOpen = false;

    lightbox.classList.remove("lightbox-active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  }

  closeButton.addEventListener(
    "click",
    closeLightbox
  );

  backdrop.addEventListener(
    "click",
    closeLightbox
  );

  /* ---------------------------------------------------------
     8. KEYBOARD CONTROLS
  --------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;

    switch (event.key) {
      case "Escape":
        closeLightbox();
        break;

      case "ArrowRight":
        showNext();
        break;

      case "ArrowLeft":
        showPrevious();
        break;

      case "Tab": {
        const focusableElements = [
          closeButton,
          prevButton,
          nextButton
        ].filter((element) => {
          return (
            !element.hidden &&
            !element.disabled
          );
        });

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableElements[0];
        const last =
          focusableElements[
            focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }

        break;
      }
    }
  });

  /* ---------------------------------------------------------
     9. OPEN IMAGE WHEN CLICKED
  --------------------------------------------------------- */

  galleryItems.forEach((item) => {
    const image = getImageElement(item);

    if (!image) return;

    image.style.cursor = "zoom-in";

    image.addEventListener("click", (event) => {
      event.preventDefault();

      const currentVisibleImages =
        getVisibleImages();

      const index = currentVisibleImages.indexOf(
        item
      );

      if (index !== -1) {
        openLightbox(index);
      }
    });
  });

  /* ---------------------------------------------------------
     10. REFRESH AFTER GALLERY FILTERING
  --------------------------------------------------------- */

  gallery.addEventListener(
    "gallery:filtered",
    () => {
      visibleImages = getVisibleImages();

      if (isOpen && visibleImages.length === 0) {
        closeLightbox();
      }
    }
  );

  console.log(
    "Golden Legacy Lightbox initialized."
  );
});