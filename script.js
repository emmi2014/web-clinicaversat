
/* =========================================
   CLÍNICA VERSALIA
   JavaScript sin frameworks
   ========================================= */

/*
  CONFIGURACIÓN:
  Escribe el número oficial de WhatsApp de la clínica.
  Usa el código de país y el número, solo dígitos.
  Ejemplo de formato: 51987654321
  No incluyas el signo + ni espacios.
*/
const WHATSAPP_NUMBER = "51902395311";

/*
  Reemplaza los enlaces de ejemplo por los perfiles
  oficiales de la clínica.
*/
const SOCIAL_LINKS = {
  Instagram: "",
  Facebook: "",
  TikTok: ""
};

/*
  Opcional:
  Añade aquí el enlace exacto de Google Maps.
  Ejemplo: https://maps.google.com/?q=...
*/
const GOOGLE_MAPS_URL = "";

/* ACTIVAR ESTILOS DE ANIMACIÓN */
document.documentElement.classList.add("js-ready");

/* ELEMENTOS */
const header = document.querySelector(".header");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const toast = document.getElementById("toast");

/* =========================================
   NOTIFICACIONES
   ========================================= */

let toastTimeout;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(toastTimeout);

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 3500);
}

/* =========================================
   MENÚ RESPONSIVE
   ========================================= */

function closeMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.classList.remove("active");
  navMenu.classList.remove("open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");

  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!menuToggle || !navMenu) return;

  menuToggle.classList.add("active");
  navMenu.classList.add("open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Cerrar menú");

  document.body.classList.add("menu-open");
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Cerrar al elegir una sección */
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  /* Cerrar con Escape */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* Cerrar si se cambia a una pantalla grande */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

/* =========================================
   ENCABEZADO AL DESPLAZARSE
   ========================================= */

function updateHeader() {
  if (!header) return;

  if (window.scrollY > 30) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();

/* =========================================
   ANIMACIONES AL APARECER EN PANTALLA
   ========================================= */

const revealElements = document.querySelectorAll(
  ".intro-visual, .intro-copy, .purpose-card, " +
  ".service-card, .benefits-copy, .benefit-item, " +
  ".gallery-item, .contact-copy, .contact-map"
);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !reducedMotion) {
  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* =========================================
   AÑO AUTOMÁTICO DEL FOOTER
   ========================================= */

const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   CONFIGURAR WHATSAPP
   ========================================= */

function createWhatsAppURL(message) {
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!cleanNumber) {
    return null;
  }

  return (
    "https://wa.me/" +
    cleanNumber +
    "?text=" +
    encodeURIComponent(message)
  );
}

function configureWhatsApp() {
  const links = [
    document.getElementById("contact-whatsapp"),
    document.getElementById("whatsapp-float")
  ];

  const message =
    "Hola, quisiera recibir información sobre los servicios de Clínica Versalia.";

  const whatsappURL = createWhatsAppURL(message);

  links.forEach((link) => {
    if (!link) return;

    if (whatsappURL) {
      link.href = whatsappURL;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.href = "#contacto";

      link.addEventListener("click", (event) => {
        event.preventDefault();

        showToast(
          "WhatsApp todavía no está configurado. " +
          "Añade el número oficial en script.js."
        );
      });
    }
  });
}

configureWhatsApp();

/* =========================================
   CONFIGURAR REDES SOCIALES
   ========================================= */

document.querySelectorAll("[data-social]").forEach((link) => {
  const socialName = link.dataset.social;
  const socialURL = SOCIAL_LINKS[socialName];

  if (socialURL && socialURL.trim() !== "") {
    link.href = socialURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";

    link.addEventListener("click", (event) => {
      event.preventDefault();

      showToast(
        "El enlace de " +
        socialName +
        " todavía no está configurado."
      );
    });
  }
});

/* =========================================
   CONFIGURAR GOOGLE MAPS
   ========================================= */

const mapLink = document.querySelector(
  ".map-placeholder .text-link"
);

if (mapLink && GOOGLE_MAPS_URL.trim() !== "") {
  mapLink.href = GOOGLE_MAPS_URL;
  mapLink.target = "_blank";
  mapLink.rel = "noopener noreferrer";
}

/* =========================================
   IMÁGENES: MANEJO DE ERRORES
   ========================================= */

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("image-error");
    image.setAttribute("alt", "Imagen no disponible");
  });
});
