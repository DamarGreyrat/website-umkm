// Model data produk UMKM (minimal 4 produk dengan properti wajib & tambahan)
const produkUmkm = [
  {
    nama: "Ayam Bakar Madu 1/4",
    kategori: "Ayam Bakar",
    harga: 20000,
    stok: 12,
    isUnggulan: true,
    deskripsi: "Potongan ayam bakar empuk berbalur bumbu rempah bakar dan madu murni khas Damar.",
    diskonPersen: 10,
  },
  {
    nama: "Ayam Bakar Madu 1 Ekor",
    kategori: "Ayam Bakar",
    harga: 40000,
    stok: 4,
    isUnggulan: true,
    deskripsi: "Satu ekor ayam utuh bakar panggang bumbu madu legit, cocok untuk santap keluarga.",
    diskonPersen: 0,
  },
  {
    nama: "Paket Nasi Kotak Komplit",
    kategori: "Bundling",
    harga: 25000,
    stok: 0,
    isUnggulan: false,
    deskripsi: "Nasi hangat, ayam madu 1/4, lalapan segar, tahu tempe, dan sambal terasi khas.",
    diskonPersen: 0,
  },
  {
    nama: "Es Jeruk Madu Pekalongan",
    kategori: "Minuman",
    harga: 8000,
    stok: 15,
    isUnggulan: false,
    deskripsi: "Kesegaran perasan jeruk asli berpadu manis alaminya madu randu penyegar dahaga.",
    diskonPersen: 0,
  },
];

console.table(produkUmkm);

const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

// Hitung harga promo dengan operator aritmatika dan validasi data
function hitungHargaPromo(harga, diskonPersen) {
  const isValidHarga = typeof harga === "number" && Number.isFinite(harga) && harga > 0;
  const isValidDiskon = typeof diskonPersen === "number" && Number.isFinite(diskonPersen) && diskonPersen > 0 && diskonPersen <= 100;

  if (!isValidHarga || !isValidDiskon) {
    return { adaDiskon: false, hargaAkhir: harga, diskonPersen: 0 };
  }

  const potongan = (harga * diskonPersen) / 100;
  const hargaAkhir = Math.round(harga - potongan);

  return {
    adaDiskon: true,
    hargaAkhir: Math.max(0, hargaAkhir),
    diskonPersen: diskonPersen,
  };
}

// Conditional 1: Status stok produk
function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }
  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }
  return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Ayam Bakar":
      return "Produk ayam bakar pilihan";
    case "Bundling":
      return "Paket hemat komplit";
    case "Minuman":
      return "Minuman penyegar khas";
    default:
      return "Produk UMKM Damar";
  }
}

// Render data ke DOM (dengan guard clause agar aman di halaman lain)
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const promo = hitungHargaPromo(produk.harga, produk.diskonPersen);

    // Conditional 2: Label produk unggulan
    const badgeUnggulanMarkup = produk.isUnggulan
      ? `<span class="badge-unggulan">&#9733; Unggulan</span>`
      : "";

    // Conditional 3: Format harga normal vs harga promo
    const hargaMarkup = promo.adaDiskon
      ? `<p class="price">
          <span class="price-promo">${formatRupiah.format(promo.hargaAkhir)}</span>
          <span class="price-original">${formatRupiah.format(produk.harga)}</span>
          <span class="discount-badge">Diskon ${promo.diskonPersen}%</span>
        </p>`
      : `<p class="price">${formatRupiah.format(produk.harga)}</p>`;

    // Conditional 4: Keterangan aksi pemesanan
    const labelAksi = produk.stok > 0 ? "Siap dipesan langsung" : "Hubungi admin untuk ketersediaan";

    if (produk.stok > 0) {
      jumlahTersedia += 1;
    }

    const kategoriText = labelKategori(produk.kategori);

    markup += `
      <article class="js-product-card">
        ${badgeUnggulanMarkup}
        <h3>${produk.nama}</h3>
        <p class="category-tag">${kategoriText}</p>
        <p class="product-desc">${produk.deskripsi}</p>
        ${hargaMarkup}
        <div>
          <span class="stock-badge ${status.className}">${status.label} (sisa: ${produk.stok})</span>
        </div>
        <p class="product-action">${labelAksi}</p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dan siap dipesan dari total ${produkUmkm.length} menu terdaftar.`;

  console.info(`[P09 Debug] Rendering DOM selesai. ${jumlahTersedia}/${produkUmkm.length} produk tersedia.`);
}

document.addEventListener("DOMContentLoaded", renderProduk);
