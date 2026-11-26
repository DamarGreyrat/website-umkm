// Pricelist Data - nesztyopage
const pricelistItems = [
  { nama: "Headshot", kategori: "Normal full render character", harga: "60k" },
  { nama: "Bust up", kategori: "Normal full render character", harga: "70k" },
  { nama: "Half body", kategori: "Normal full render character", harga: "80k" },
  { nama: "Knee up", kategori: "Normal full render character", harga: "100k" },
  { nama: "Fullbody", kategori: "Normal full render character", harga: "150k" },

  { nama: "Headshot", kategori: "Chibi full render character", harga: "40k" },
  { nama: "Halfbody", kategori: "Chibi full render character", harga: "60k" },
  { nama: "Fullbody", kategori: "Chibi full render character", harga: "80k" },

  { nama: "Headshot", kategori: "Simple Chibi", harga: "15k" },
  { nama: "Halfbody", kategori: "Simple Chibi", harga: "20k" },
  { nama: "Fullbody", kategori: "Simple Chibi", harga: "30k" },
];

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

function buatElemenProduk(item) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = item.kategori;

  const title = document.createElement("h3");
  title.textContent = item.nama;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = item.harga;

  const actions = document.createElement("div");
  actions.classList.add("card-actions");

  const orderLink = document.createElement("a");
  orderLink.classList.add("button");
  orderLink.href = "kontak.html";
  orderLink.textContent = "Order";

  actions.append(orderLink);
  card.append(category, title, price, actions);

  return card;
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `No items found in ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "All") {
  if (!produkGrid || !produkStatus) {
    return;
  }

  const produkTampil =
    kategoriAktif === "All"
      ? pricelistItems
      : pricelistItems.filter((item) => item.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 items found.";
    return;
  }

  produkTampil.forEach((item) => {
    produkGrid.append(buatElemenProduk(item));
  });

  produkStatus.textContent = `${produkTampil.length} items displayed.`;
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

renderProduk();
