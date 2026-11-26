const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');

const STORAGE_KEY = "nesztyopage-contact-preferences";

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "This field is required.";
  if (validity.typeMismatch) return "Invalid format.";
  if (validity.tooShort || (field.minLength > 0 && field.value && field.value.length < field.minLength)) {
    return `Please enter at least ${field.minLength} characters.`;
  }
  if (validity.patternMismatch) return "Format does not match the requested example.";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const topikError = document.querySelector("#topik-error");
  const topikValid = Array.from(topikInputs).some((input) => input.checked);
  const pesan = topikValid ? "" : "This field is required.";

  topikInputs.forEach((input) => {
    input.setCustomValidity(pesan);
    input.setAttribute("aria-invalid", pesan ? "true" : "false");
  });

  if (topikError) {
    topikError.textContent = pesan;
  }

  return topikValid;
}

function tampilkanPreview() {
  const data = new FormData(form);
  preview.textContent = [
    `Name: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("telepon")}`,
    `Commission Type: ${data.get("paket")}`,
    `Topic: ${data.get("topik")}`,
    `Message: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form is valid. Preview generated successfully.";
  formFeedback.classList.add("success");
}

function updatePreferensiUI(preferensi) {
  const statusEl = document.querySelector("#preferensi-status");
  if (!statusEl) return;

  if (preferensi && (preferensi.paket || preferensi.topik)) {
    statusEl.textContent = `Saved: Commission Type "${preferensi.paket || "-"}", Topic "${preferensi.topik || "-"}".`;
  } else {
    statusEl.textContent = "No preferences saved on this device yet.";
  }
}

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket"),
    topik: data.get("topik"),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
  updatePreferensiUI(preferensi);
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) {
      updatePreferensiUI(null);
      return;
    }

    const preferensi = JSON.parse(tersimpan);
    const paketSelect = document.querySelector("#paket");
    if (paketSelect && preferensi.paket) {
      paketSelect.value = preferensi.paket;
    }
    const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
    if (topik) {
      topik.checked = true;
    }

    updatePreferensiUI(preferensi);
  } catch (error) {
    console.warn("Invalid preferences.", error);
    localStorage.removeItem(STORAGE_KEY);
    updatePreferensiUI(null);
  }
}

function hapusPreferensi() {
  localStorage.removeItem(STORAGE_KEY);
  updatePreferensiUI(null);
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    fields.forEach((field) => {
      if (field) validasiField(field);
    });
    const topikValid = validasiTopik();
    const semuaValid = fields.every((field) => validasiField(field));

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Please review the highlighted fields.";
      formFeedback.classList.remove("success");
      if (preview) {
        preview.textContent = "";
      }
      form.reportValidity();
      form.querySelector(":invalid")?.focus();
      return;
    }

    simpanPreferensi();
    tampilkanPreview();
  });

  fields.forEach((field) => {
    if (!field) return;
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") {
        validasiField(field);
      }
    });
    field.addEventListener("blur", () => {
      validasiField(field);
    });
  });

  topikInputs.forEach((input) => {
    input.addEventListener("change", () => {
      validasiTopik();
    });
  });
}

const btnHapusPreferensi = document.querySelector("#btn-hapus-preferensi");
if (btnHapusPreferensi) {
  btnHapusPreferensi.addEventListener("click", () => {
    hapusPreferensi();
    const paketSelect = document.querySelector("#paket");
    if (paketSelect) {
      paketSelect.value = "";
    }
    topikInputs.forEach((input) => {
      input.checked = false;
    });
    const statusEl = document.querySelector("#preferensi-status");
    if (statusEl) {
      statusEl.textContent = "Preferences cleared.";
    }
  });
}

muatPreferensi();
