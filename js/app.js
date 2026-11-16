// 1. Data Produk UMKM Ayam Bakar Madu Damar (P10 & P11)
const produkUmkm = [
  { nama: "Ayam Bakar Madu 1/4", kategori: "Makanan", harga: 20000, stok: 15, unggulan: true },
  { nama: "Ayam Bakar Madu 1 Ekor", kategori: "Makanan", harga: 40000, stok: 8, unggulan: true },
  { nama: "Sate Ayam Madu (10 Tusuk)", kategori: "Makanan", harga: 19000, stok: 5, unggulan: false },
  { nama: "Kulit Ayam Bakar Madu Crispy", kategori: "Makanan", harga: 15000, stok: 3, unggulan: false },
  { nama: "Paket Nasi Kotak Komplit", kategori: "Paket Hemat", harga: 25000, stok: 0, unggulan: false },
  { nama: "Es Jeruk Madu Pekalongan", kategori: "Minuman", harga: 8000, stok: 20, unggulan: false },
  { nama: "Wedang Jahe Madu Hangat", kategori: "Minuman", harga: 7000, stok: 12, unggulan: false },
];

// 2. Function formatRupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

// 3. Function statusStok
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "warning" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

// 4. DOM Selection
const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");

// 5. Function pembuat elemen produk (buatElemenProduk)
function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, price, stock);

  // 8. Uji remove element (tombol Sembunyikan)
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    if (produkStatus) {
      produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
    }
  });

  card.append(removeButton);

  return card;
}

// 6. Function buatEmptyState & renderProduk
function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  const produkTampil =
    kategoriAktif === "Semua"
      ? produkUmkm
      : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

// 7. Pasang event listener dan classList
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

// Pemanggilan awal saat halaman dimuat
renderProduk();
