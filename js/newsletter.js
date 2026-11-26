(() => {
  const formNewsletter = document.querySelector("#form-newsletter");
  if (!formNewsletter) return;

  const emailInput = formNewsletter.querySelector("#newsletter-email");
  const errorEl = formNewsletter.querySelector("#newsletter-error");
  const feedbackEl = formNewsletter.querySelector("#newsletter-feedback");
  const STORAGE_KEY_NEWSLETTER = "nesztyopage-newsletter-email";

  function getNewsletterError(input) {
    const validity = input.validity;
    if (validity.valueMissing) return "Email is required to subscribe.";
    if (validity.typeMismatch) return "Invalid email format.";
    return "";
  }

  function validasiNewsletter() {
    if (!emailInput) return true;
    emailInput.setCustomValidity("");
    const pesan = getNewsletterError(emailInput);
    emailInput.setCustomValidity(pesan);
    emailInput.setAttribute("aria-invalid", pesan ? "true" : "false");

    if (errorEl) {
      errorEl.textContent = pesan;
    }
    return pesan === "";
  }

  function simpanPreferensiNewsletter(email) {
    const data = {
      email: email,
      subscribedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_NEWSLETTER, JSON.stringify(data));
  }

  function muatPreferensiNewsletter() {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY_NEWSLETTER);
      if (!tersimpan) return;

      const data = JSON.parse(tersimpan);
      if (data && data.email && emailInput) {
        emailInput.value = data.email;
        if (feedbackEl) {
          feedbackEl.textContent = `Email (${data.email}) is saved for commission updates.`;
          feedbackEl.classList.add("success");
        }
      }
    } catch (error) {
      console.warn("Invalid newsletter data.", error);
      localStorage.removeItem(STORAGE_KEY_NEWSLETTER);
    }
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      if (emailInput.getAttribute("aria-invalid") === "true") {
        validasiNewsletter();
      }
    });

    emailInput.addEventListener("blur", () => {
      validasiNewsletter();
    });
  }

  formNewsletter.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = validasiNewsletter();

    if (!isValid || !formNewsletter.checkValidity()) {
      if (feedbackEl) {
        feedbackEl.textContent = "Invalid email format. Please check again.";
        feedbackEl.classList.remove("success");
      }
      formNewsletter.reportValidity();
      emailInput?.focus();
      return;
    }

    try {
      simpanPreferensiNewsletter(emailInput.value);
    } catch (error) {
      console.warn("Failed to save newsletter data.", error);
    }

    if (feedbackEl) {
      feedbackEl.textContent = "Thank you! You have successfully subscribed to updates.";
      feedbackEl.classList.add("success");
    }

    formNewsletter.reset();
  });

  muatPreferensiNewsletter();
})();
