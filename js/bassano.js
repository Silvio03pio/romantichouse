/* js/bassano.js – Lightbox Bassano */

(function () {
  "use strict";

  const items = Array.from(document.querySelectorAll(".house-collage .hc-item"));
  const lightbox = document.getElementById("rhLightbox");
  const imgEl = document.getElementById("rhLightboxImg");

  if (!items.length || !lightbox || !imgEl) return;

  const panel = lightbox.querySelector(".rh-lightbox__panel") || lightbox;
  const closeEls = Array.from(lightbox.querySelectorAll('[data-close="1"]'));

  // Costruisci lista immagini (full + alt)
  const images = items
    .map((btn) => {
      const full = btn.getAttribute("data-full");
      const im = btn.querySelector("img");
      return {
        full: full || (im ? im.getAttribute("src") : ""),
        alt: im ? (im.getAttribute("alt") || "") : ""
      };
    })
    .filter((x) => x.full);

  let index = 0;
  let isOpen = false;

  // Inject nav buttons (prev/next) se non esistono
  let prevBtn = lightbox.querySelector(".rh-lightbox__prev");
  let nextBtn = lightbox.querySelector(".rh-lightbox__next");

  if (!prevBtn) {
    prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "rh-lightbox__nav rh-lightbox__prev";
    prevBtn.setAttribute("aria-label", "Foto precedente");
    prevBtn.textContent = "‹";
    panel.appendChild(prevBtn);
  }

  if (!nextBtn) {
    nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "rh-lightbox__nav rh-lightbox__next";
    nextBtn.setAttribute("aria-label", "Foto successiva");
    nextBtn.textContent = "›";
    panel.appendChild(nextBtn);
  }

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
  }

  function preload(src) {
    if (!src) return;
    const im = new Image();
    im.src = src;
  }

  function setImage(i) {
    if (!images.length) return;
    if (i < 0) i = images.length - 1;
    if (i >= images.length) i = 0;
    index = i;

    const { full, alt } = images[index];
    imgEl.src = full;
    imgEl.alt = alt || "Foto";

    // pre-carica successiva
    preload(images[(index + 1) % images.length]?.full);
  }

  function open(i) {
    isOpen = true;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lockScroll();
    setImage(i);

    // focus sul close se c'è
    const closeBtn = lightbox.querySelector(".rh-lightbox__close");
    closeBtn?.focus({ preventScroll: true });
  }

  function close() {
    isOpen = false;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    imgEl.alt = "";
    unlockScroll();
  }

  function next() { setImage(index + 1); }
  function prev() { setImage(index - 1); }

  // click collage
  items.forEach((btn, i) => btn.addEventListener("click", () => open(i)));

  // chiusura su backdrop / close
  closeEls.forEach((el) => el.addEventListener("click", close));

  // prev/next
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); next(); });

  // ESC + frecce
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;

    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  });

  // Swipe mobile (orizzontale)
  let startX = 0;
  let startY = 0;
  let active = false;

  panel.addEventListener("touchstart", (e) => {
    if (!isOpen) return;
    if (!e.touches || e.touches.length !== 1) return;
    active = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  panel.addEventListener("touchend", (e) => {
    if (!active || !isOpen) return;
    active = false;
    if (!e.changedTouches || e.changedTouches.length !== 1) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    if (Math.abs(dx) > 55 && Math.abs(dy) < 40) {
      if (dx < 0) next();
      else prev();
    }
  }, { passive: true });
})();
