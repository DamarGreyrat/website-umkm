const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "telepon", "paket", "pesan", "setuju"].map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');

const STORAGE_KEY = "kopi-nusa-preferensi-kontak";

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort || (field.minLength > 0 && field.value && field.value.length < field.minLength)) {
    return `Isi minimal ${field.minLength} karakter.`;
  }
  if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";

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
  const pesan = topikValid ? "" : "Bagian ini wajib diisi.";

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
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `Telepon: ${data.get("telepon")}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

function updatePreferensiUI(preferensi) {
  const statusEl = document.querySelector("#preferensi-status");
  if (!statusEl) return;

  if (preferensi && (preferensi.paket || preferensi.topik)) {
    statusEl.textContent = `Tersimpan: Paket "${preferensi.paket || "-"}", Topik "${preferensi.topik || "-"}".`;
  } else {
    statusEl.textContent = "Belum ada preferensi tersimpan di perangkat ini.";
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
    console.warn("Preferensi tidak valid.", error);
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

    // Validasi semua field dan topik untuk memunculkan error state
    fields.forEach((field) => {
      if (field) validasiField(field);
    });
    const topikValid = validasiTopik();
    const semuaValid = fields.every((field) => validasiField(field));

    if (!semuaValid || !topikValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
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

  // Listener interaktif agar status error diperbarui saat pengguna mulai mengisi
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
      statusEl.textContent = "Preferensi berhasil dihapus.";
    }
  });
}

// Muat data preferensi lokal saat halaman dimuat
muatPreferensi();
