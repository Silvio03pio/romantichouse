/* js/includes.js
   - Include automatico di qualunque blocco con attributo: data-include="...".
   - Funziona su TUTTE le pagine (root e sottocartelle) perché NON dipende da path fissi.
   - Dopo gli include: imposta anno footer e link attivo nel menu.
*/
(async function () {
  "use strict";

  async function inject(host) {
    const url = host.getAttribute("data-include");
    if (!url) return;

    try {
      const res = await fetch(url, {
        cache: "no-cache",
        credentials: "same-origin",
      });

      if (!res.ok) {
        console.error("[includes] Include failed:", url, res.status);
        return;
      }

      host.innerHTML = await res.text();
    } catch (err) {
      console.error("[includes] Include error:", url, err);
    }
  }

  // 1) Include: carica TUTTI i partial presenti nella pagina (header, footer, ecc.)
  const hosts = Array.from(document.querySelectorAll("[data-include]"));
  for (const host of hosts) {
    await inject(host);
  }

  // 2) Footer: anno automatico (se presente)
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  // 3) Header: link attivo (automatico)
  //    - Confronta il "basename" del path: es. /houses/bassano.html -> bassano.html
  //    - Funziona anche con index.html o / (home)
  const path = window.location.pathname.replace(/\/+$/, "");
  const currentFile = path.split("/").pop() || "index.html";

  document.querySelectorAll(".site-header a.nav-link").forEach((a) => {
    const href = (a.getAttribute("href") || "").trim();
    if (!href) return;

    // Rimuove query/hash e prende il basename del link
    const clean = href.split("#")[0].split("?")[0].replace(/\/+$/, "");
    const linkFile = clean.split("/").pop() || "";

    const isHome = currentFile === "" || currentFile === "index.html";
    const linkIsHome = linkFile === "" || linkFile === "index.html";

    const isActive = linkFile === currentFile || (isHome && linkIsHome);

    a.classList.toggle("is-active", isActive);
  });
})();
