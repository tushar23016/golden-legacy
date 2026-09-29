
/* =========================================================
   GOLDEN LEGACY — GALLERY SYSTEM
   File: assets/js/gallery.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const galleryGrid = gallery.querySelector(
    ".gallery-grid, .gallery-container"
  );

  const galleryItems = Array.from(
    gallery.querySelectorAll(
      ".gallery-item, .gallery-card"
    )
  );

  const filterButtons = Array.from(
    gallery.querySelectorAll(
      ".gallery-filter, [data-gallery-filter]"
    )
  );

  const sortSelect = gallery.querySelector(
    ".gallery-sort, [data-gallery-sort]"
  );

  if (!galleryGrid || galleryItems.length === 0) return;

  let activeFilter = "all";
  let currentSort = "default";

  /* ---------------------------------------------------------
     1. IMAGE LOADING EFFECT
  --------------------------------------------------------- */

  function handleImageLoading() {
    const images = gallery.querySelectorAll("img");

    images.forEach((image) => {
      const item = image.closest(
        ".gallery-item, .gallery-card"
      );

      if (!item) return;

      if (image.complete && image.naturalWidth > 0) {
        item.classList.add("image-loaded");
      } else {
        image.addEventListener(
          "load",
          () => {
            item.classList.add("image-loaded");
          },
          { once: true }
        );

        image.addEventListener(
          "error",
          () => {
            item.classList.add("image-error");
          },
          { once: true }
        );
      }
    });
  }

  handleImageLoading();

  /* ---------------------------------------------------------
     2. GALLERY FILTERING
  --------------------------------------------------------- */

  function getItemCategory(item) {
    return (
      item.dataset.category ||
      item.dataset.filter ||
      "uncategorized"
    ).toLowerCase();
  }

  function filterGallery(category) {
    activeFilter = category.toLowerCase();

    galleryItems.forEach((item, index) => {
      const itemCategory = getItemCategory(item);

      const shouldShow =
        activeFilter === "all" ||
        itemCategory === activeFilter;

      item.classList.toggle(
        "gallery-item-hidden",
        !shouldShow
      );

      item.setAttribute(
        "aria-hidden",
        String(!shouldShow)
      );

      if (shouldShow) {
        item.style.order = index;
      }
    });

    filterButtons.forEach((button) => {
      const buttonFilter = (
        button.dataset.galleryFilter ||
        button.dataset.filter ||
        button.dataset.category ||
        "all"
      ).toLowerCase();

      const isActive = buttonFilter === activeFilter;

      button.classList.toggle("active", isActive);

      button.setAttribute(
        "aria-pressed",
        String(isActive)
      );
    });

    gallery.dispatchEvent(
      new CustomEvent("gallery:filtered", {
        detail: {
          category: activeFilter,
          visibleCount: galleryItems.filter(
            (item) =>
              !item.classList.contains(
                "gallery-item-hidden"
              )
          ).length
        }
      })
    );
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = (
        button.dataset.galleryFilter ||
        button.dataset.filter ||
        button.dataset.category ||
        "all"
      ).toLowerCase();

      filterGallery(category);
    });
  });

  /* ---------------------------------------------------------
     3. GALLERY SORTING
  --------------------------------------------------------- */

  function sortGallery(sortType) {
    currentSort = sortType;

    const sortedItems = [...galleryItems];

    if (sortType === "newest") {
      sortedItems.sort((a, b) => {
        return (
          getDateValue(b) - getDateValue(a)
        );
      });
    } else if (sortType === "oldest") {
      sortedItems.sort((a, b) => {
        return (
          getDateValue(a) - getDateValue(b)
        );
      });
    } else if (sortType === "name") {
      sortedItems.sort((a, b) => {
        return getItemName(a).localeCompare(
          getItemName(b)
        );
      });
    } else {
      sortedItems.sort((a, b) => {
        return (
          Number(a.dataset.originalOrder || 0) -
          Number(b.dataset.originalOrder || 0)
        );
      });
    }

    sortedItems.forEach((item, index) => {
      item.dataset.originalOrder ??= index;
      galleryGrid.appendChild(item);
    });
  }

  function getDateValue(item) {
    const date = item.dataset.date;

    if (!date) return 0;

    const timestamp = new Date(date).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function getItemName(item) {
    const title = item.querySelector(
      ".gallery-title, .gallery-caption, figcaption"
    );

    return (
      item.dataset.name ||
      title?.textContent.trim() ||
      ""
    ).toLowerCase();
  }

  galleryItems.forEach((item, index) => {
    item.dataset.originalOrder = index;
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      sortGallery(sortSelect.value);
      filterGallery(activeFilter);
    });
  }

  /* ---------------------------------------------------------
     4. GALLERY ITEM INTERACTIONS
  --------------------------------------------------------- */

  galleryItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("gallery-item-hover");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("gallery-item-hover");
    });

    item.addEventListener("keydown", (event) => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        const image = item.querySelector("img");

        if (image) {
          event.preventDefault();
          image.click();
        }
      }
    });
  });

  /* ---------------------------------------------------------
     5. GALLERY COUNTER
  --------------------------------------------------------- */

  function updateGalleryCounter() {
    const counter = gallery.querySelector(
      ".gallery-counter, [data-gallery-counter]"
    );

    if (!counter) return;

    const visibleItems = galleryItems.filter(
      (item) =>
        !item.classList.contains(
          "gallery-item-hidden"
        )
    );

    counter.textContent =
      `${visibleItems.length} Memories`;
  }

  gallery.addEventListener(
    "gallery:filtered",
    updateGalleryCounter
  );

  /* ---------------------------------------------------------
     6. INITIALIZE GALLERY
  --------------------------------------------------------- */

  filterGallery("all");
  updateGalleryCounter();

  if (sortSelect) {
    sortGallery(sortSelect.value || "default");
  }

  console.log("Golden Legacy Gallery initialized.");
});