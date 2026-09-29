
/* =========================================================
   GOLDEN LEGACY — VIDEO PLAYER
   File: assets/js/video-player.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const videoCards = document.querySelectorAll(
    ".video-card, .memory-video-card"
  );

  const videoPlayers = document.querySelectorAll(
    ".video-player, video[data-custom-player]"
  );

  /* ---------------------------------------------------------
     1. INITIALIZE VIDEO PLAYERS
  --------------------------------------------------------- */

  videoPlayers.forEach((video) => {
    initializeVideo(video);
  });

  function initializeVideo(video) {
    const container = video.closest(
      ".video-player-container, .video-wrapper, .video-card"
    ) || video.parentElement;

    if (!container) return;

    container.classList.add("custom-video-player");

    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "metadata");

    /* Create controls */

    let controls = container.querySelector(
      ".video-controls"
    );

    if (!controls) {
      controls = document.createElement("div");

      controls.className = "video-controls";

      controls.innerHTML = `
        <button
          class="video-play-toggle"
          type="button"
          aria-label="Play video">
          <span class="video-play-icon">&#9654;</span>
        </button>

        <div class="video-progress-container">
          <input
            class="video-progress"
            type="range"
            min="0"
            max="100"
            value="0"
            step="0.1"
            aria-label="Video progress">
        </div>

        <span class="video-time">0:00 / 0:00</span>

        <button
          class="video-mute-toggle"
          type="button"
          aria-label="Mute video">
          <span class="video-volume-icon">&#128266;</span>
        </button>

        <input
          class="video-volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value="${video.volume}"
          aria-label="Volume">

        <button
          class="video-fullscreen-toggle"
          type="button"
          aria-label="Enter fullscreen">
          <span>&#9974;</span>
        </button>
      `;

      container.appendChild(controls);
    }

    const playButton = controls.querySelector(
      ".video-play-toggle"
    );

    const playIcon = controls.querySelector(
      ".video-play-icon"
    );

    const progress = controls.querySelector(
      ".video-progress"
    );

    const timeDisplay = controls.querySelector(
      ".video-time"
    );

    const muteButton = controls.querySelector(
      ".video-mute-toggle"
    );

    const volumeSlider = controls.querySelector(
      ".video-volume"
    );

    const fullscreenButton = controls.querySelector(
      ".video-fullscreen-toggle"
    );

    const volumeIcon = controls.querySelector(
      ".video-volume-icon"
    );

    if (
      !playButton ||
      !progress ||
      !timeDisplay ||
      !muteButton ||
      !volumeSlider ||
      !fullscreenButton
    ) {
      return;
    }

    /* -------------------------------------------------------
       2. FORMAT VIDEO TIME
    ------------------------------------------------------- */

    function formatTime(seconds) {
      if (!Number.isFinite(seconds)) {
        return "0:00";
      }

      const minutes = Math.floor(seconds / 60);

      const remainingSeconds = Math.floor(
        seconds % 60
      );

      return (
        minutes +
        ":" +
        String(remainingSeconds).padStart(2, "0")
      );
    }

    function updateTime() {
      timeDisplay.textContent =
        `${formatTime(video.currentTime)} / ` +
        `${formatTime(video.duration)}`;
    }

    /* -------------------------------------------------------
       3. PLAY AND PAUSE
    ------------------------------------------------------- */

    function updatePlayButton() {
      const isPlaying = !video.paused;

      container.classList.toggle(
        "video-playing",
        isPlaying
      );

      playButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause video" : "Play video"
      );

      if (playIcon) {
        playIcon.textContent = isPlaying
          ? "❚❚"
          : "▶";
      }
    }

    async function togglePlayback() {
      if (video.paused || video.ended) {
        try {
          await video.play();
        } catch (error) {
          console.warn(
            "Video playback could not start:",
            error
          );
        }
      } else {
        video.pause();
      }

      updatePlayButton();
    }

    playButton.addEventListener(
      "click",
      togglePlayback
    );

    video.addEventListener(
      "click",
      togglePlayback
    );

    video.addEventListener(
      "play",
      updatePlayButton
    );

    video.addEventListener(
      "pause",
      updatePlayButton
    );

    video.addEventListener(
      "ended",
      updatePlayButton
    );

    /* -------------------------------------------------------
       4. VIDEO PROGRESS
    ------------------------------------------------------- */

    function updateProgress() {
      if (
        !Number.isFinite(video.duration) ||
        video.duration <= 0
      ) {
        progress.value = 0;
        updateTime();
        return;
      }

      const percentage =
        (video.currentTime / video.duration) * 100;

      progress.value = percentage;

      progress.style.setProperty(
        "--video-progress",
        `${percentage}%`
      );

      updateTime();
    }

    progress.addEventListener("input", () => {
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0
      ) {
        video.currentTime =
          (Number(progress.value) / 100) *
          video.duration;
      }
    });

    video.addEventListener(
      "timeupdate",
      updateProgress
    );

    video.addEventListener(
      "loadedmetadata",
      updateProgress
    );

    /* -------------------------------------------------------
       5. VOLUME AND MUTE
    ------------------------------------------------------- */

    function updateVolumeIcon() {
      if (!volumeIcon) return;

      if (video.muted || video.volume === 0) {
        volumeIcon.textContent = "🔇";
      } else if (video.volume < 0.5) {
        volumeIcon.textContent = "🔉";
      } else {
        volumeIcon.textContent = "🔊";
      }

      muteButton.setAttribute(
        "aria-label",
        video.muted ? "Unmute video" : "Mute video"
      );
    }

    muteButton.addEventListener("click", () => {
      video.muted = !video.muted;
      updateVolumeIcon();
    });

    volumeSlider.addEventListener(
      "input",
      () => {
        video.volume = Number(volumeSlider.value);

        video.muted = video.volume === 0;

        updateVolumeIcon();
      }
    );

    video.addEventListener(
      "volumechange",
      () => {
        volumeSlider.value = video.muted
          ? 0
          : video.volume;

        updateVolumeIcon();
      }
    );

    /* -------------------------------------------------------
       6. FULLSCREEN
    ------------------------------------------------------- */

    async function toggleFullscreen() {
      try {
        if (!document.fullscreenElement) {
          await container.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.warn(
          "Fullscreen is not available:",
          error
        );
      }
    }

    fullscreenButton.addEventListener(
      "click",
      toggleFullscreen
    );

    document.addEventListener(
      "fullscreenchange",
      () => {
        const isFullscreen =
          document.fullscreenElement === container;

        fullscreenButton.setAttribute(
          "aria-label",
          isFullscreen
            ? "Exit fullscreen"
            : "Enter fullscreen"
        );

        container.classList.toggle(
          "video-fullscreen",
          isFullscreen
        );
      }
    );

    /* -------------------------------------------------------
       7. VIDEO LOADING
    ------------------------------------------------------- */

    video.addEventListener("waiting", () => {
      container.classList.add("video-buffering");
    });

    video.addEventListener("playing", () => {
      container.classList.remove("video-buffering");
    });

    video.addEventListener("canplay", () => {
      container.classList.add("video-ready");
    });

    video.addEventListener("error", () => {
      container.classList.add("video-error");

      console.error(
        "Unable to load video:",
        video.currentSrc || video.src
      );
    });

    /* -------------------------------------------------------
       8. INITIAL STATE
    ------------------------------------------------------- */

    updatePlayButton();
    updateTime();
    updateVolumeIcon();
  }

  /* ---------------------------------------------------------
     9. VIDEO CARD HOVER EFFECTS
  --------------------------------------------------------- */

  videoCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("video-card-hover");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("video-card-hover");
    });
  });

  console.log(
    "Golden Legacy Video Player initialized."
  );
});