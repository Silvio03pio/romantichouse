(function () {
  const logoBtn = document.querySelector("[data-logo-toggle]");
  const logoDesc = document.querySelector("[data-logo-desc]");

  if (logoBtn && logoDesc) {
    logoBtn.addEventListener("click", () => {
      logoDesc.classList.toggle("is-open");
    });
  }
})();


(function () {
  const splash = document.getElementById("splash");
  const splashBtn = document.getElementById("splashBtn");
  const site = document.getElementById("site");

  if (splash && splashBtn && site) {
    const STORAGE_KEY = "rh_splash_seen";

    // Se già visto, non mostrare lo splash
    const seen = localStorage.getItem(STORAGE_KEY) === "1";
    if (seen) {
      splash.style.display = "none";
      site.classList.remove("is-hidden");
      return; // importante: evita di rimettere event listener inutili
    } else {
      // Prima volta: sito nascosto finché non clicca
      site.classList.add("is-hidden");
    }

    const openSite = () => {
      // Fade out (opzionale)
      splash.classList.add("is-hiding");

      window.setTimeout(() => {
        splash.style.display = "none";
        site.classList.remove("is-hidden");
      }, 240);

      // Salva che lo splash è stato visto
      localStorage.setItem(STORAGE_KEY, "1");
    };

    splashBtn.addEventListener("click", openSite);

    // Accessibilità: invio/space già funzionano perché è un <button>
  }
})();


(() => {
  const STORAGE_KEY = "rh_discount_popup_dismissed_v1";
  const OPEN_DELAY_MS = 700; // piccolo delay elegante all'apertura

  const modal = document.getElementById("rhModal");
  if (!modal) return;

  const closeBtn = document.getElementById("rhModalClose");
  const noThanksBtn = document.getElementById("rhNoThanks");
  const form = document.getElementById("rhDiscountForm");
  const emailInput = document.getElementById("rhEmail");
  const successBox = document.getElementById("rhSuccess");
  const errorBox = document.getElementById("rhError");
  const submitBtn = document.getElementById("rhSubmitBtn");

  const isDismissed = () => localStorage.getItem(STORAGE_KEY) === "1";

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => emailInput?.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    localStorage.setItem(STORAGE_KEY, "1");
  }

  function validateEmail(email) {
    // Validazione semplice ma efficace
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  }

  // OPEN on load (solo una volta)
  window.addEventListener("load", () => {
    if (isDismissed()) return;
    setTimeout(openModal, OPEN_DELAY_MS);
  });

  // Close actions
  closeBtn?.addEventListener("click", closeModal);
  noThanksBtn?.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // Submit
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.textContent = "";
    successBox.style.display = "none";

    const email = (emailInput?.value || "").trim();
    if (!validateEmail(email)) {
      errorBox.textContent = "Inserisci un’email valida.";
      emailInput?.focus();
      return;
    }

    // UI loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Invio in corso...";

    try {
      // ✅ QUI COLLEGHI IL TUO SERVIZIO:
      // Opzione A) endpoint tuo:
      // await fetch("/api/discount", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email })
      // });

      // Simulazione OK:
      await new Promise(r => setTimeout(r, 700));

      successBox.style.display = "block";
      localStorage.setItem(STORAGE_KEY, "1");

      setTimeout(closeModal, 1500);
    } catch (err) {
      errorBox.textContent = "Errore durante l’invio. Riprova tra poco.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Ricevi il codice";
    }
  });
})();
