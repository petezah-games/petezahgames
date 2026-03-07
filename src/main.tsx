import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { initBrowser } from "./lib/browserInit";
import App from "./App";
import "./index.css";

initBrowser().catch((err) => {
  console.warn("[browser] Init error:", err.message);
});

function applyStoredSettings() {
  const get = (k: string) => localStorage.getItem(k);

  const theme = get("theme");
  if (theme) {
    document.body.className = document.body.className.replace(/theme-[\w-]+/g, "").trim();
    document.body.classList.add(`theme-${theme}`);
  }

  const siteTitle = get("siteTitle");
  if (siteTitle) {
    document.title = siteTitle;
  } else {
    setTimeout(() => { document.title = "PeteZah"; }, 3000);
  }

  const siteLogo = get("siteLogo");
  if (siteLogo) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = siteLogo;
  }

  const bgColor = get("backgroundColor");
  if (bgColor && !get("backgroundImage")) {
    document.body.style.backgroundColor = bgColor;
  }

  if (get("disableRightClick") === "true") {
    const h = (e: MouseEvent) => e.preventDefault();
    (window as any).__rightClickHandler = h;
    document.addEventListener("contextmenu", h);
  }

  if (get("beforeUnload") === "true") {
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    (window as any).__beforeUnloadHandler = h;
    window.addEventListener("beforeunload", h);
  }

  const panicKey = get("panicKey");
  const panicUrl = get("panicUrl");
  if (panicKey && panicUrl) {
    const h = (e: KeyboardEvent) => { if (e.key === panicKey) window.location.href = panicUrl; };
    (window as any).__panicKeyHandler = h;
    window.addEventListener("keydown", h);
  }

  if (get("disableParticles") === "true") {
    const removeParticles = () => {
      document.querySelectorAll(".particles, .particle").forEach(el => el.parentNode?.removeChild(el));
    };
    removeParticles();
    setTimeout(removeParticles, 500);
    setTimeout(removeParticles, 1500);
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "settingsUpdated") applyStoredSettings();
  });
}

applyStoredSettings();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);