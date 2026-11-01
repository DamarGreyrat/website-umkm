document.addEventListener("DOMContentLoaded", () => {
  // Tombol promo hari ini (halaman beranda)
  const promoButton = document.querySelector("#promoButton");
  if (promoButton) {
    promoButton.addEventListener("click", () => {
      promoButton.textContent = "Promo: Beli 2 gratis es teh!";
      console.log("Promo Ayam Bakar Madu Damar berhasil ditampilkan.");
    });
  }

  // Hamburger menu navigasi mobile
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#primary-nav");

  if (navToggle && navMenu) {
    const toggleMenu = (open) => {
      const willOpen = typeof open === "boolean" ? open : !navMenu.classList.contains("is-open");
      navToggle.setAttribute("aria-expanded", String(willOpen));
      navToggle.setAttribute("aria-label", willOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
      navMenu.classList.toggle("is-open", willOpen);
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Menutup menu saat klik di luar area navigasi
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("is-open") &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Menutup menu dengan tombol Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        toggleMenu(false);
        navToggle.focus();
      }
    });

    // Menutup menu setelah link navigasi diklik pada mobile
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 672) {
          toggleMenu(false);
        }
      });
    });

    // Menutup menu jika jendela diperbesar melebihi batas mobile breakpoint
    const mediaQuery = window.matchMedia("(min-width: 42rem)");
    mediaQuery.addEventListener("change", (e) => {
      if (e.matches) {
        toggleMenu(false);
      }
    });
  }
});
