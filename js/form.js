const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  preview.textContent = [
    `Nama: ${data.get("nama") || "-"}`,
    `Email: ${data.get("email") || "-"}`,
    `WhatsApp: ${data.get("whatsapp") || "-"}`,
    `Paket: ${data.get("paket") || "-"}`,
    `Waktu Kontak: ${data.get("waktu_kontak") || "-"}`,
    `Topik: ${data.get("topik") || "-"}`,
    `Pesan: ${data.get("pesan") || "-"}`,
  ].join("\n");
});