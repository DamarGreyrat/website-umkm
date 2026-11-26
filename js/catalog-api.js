const DATA_URL = "data/products.json";
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "All";

/**
 * Updates the accessible status indicator with a UI state class and message.
 */
function setStatus(state, message) {
  if (!catalogStatus) return;
  catalogStatus.className = "catalog-status";
  if (state) {
    catalogStatus.classList.add(state);
  }
  catalogStatus.textContent = message;
}

/**
 * Formats numeric IDR prices for display.
 */
function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Creates a full-width grid message element for loading, empty, or error states.
 */
function createStateMessage(className, message) {
  const box = document.createElement("p");
  box.className = className;
  box.textContent = message;
  return box;
}

function createEmptyState(category) {
  const message =
    products.length === 0
      ? "No commission items are available at the moment."
      : `No commission items found in "${category}".`;
  return createStateMessage("empty-state", message);
}

/**
 * Builds a single commission product card DOM element.
 */
function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("js-product-card");

  if (product.featured) {
    const featuredBadge = document.createElement("span");
    featuredBadge.classList.add("badge-unggulan");
    featuredBadge.textContent = "Featured";
    card.append(featuredBadge);
  }

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = product.category;

  const title = document.createElement("h3");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.classList.add("product-desc");
  description.textContent = product.description;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatPrice(product.price);

  const stock = document.createElement("span");
  stock.classList.add("stock-badge");
  if (product.stock <= 0) {
    stock.classList.add("empty");
    stock.textContent = "Slots full";
  } else if (product.stock <= 3) {
    stock.classList.add("warning");
    stock.textContent = `Limited: ${product.stock} slots left`;
  } else {
    stock.textContent = `Available: ${product.stock} slots`;
  }

  const actions = document.createElement("div");
  actions.classList.add("card-actions");

  const orderLink = document.createElement("a");
  orderLink.classList.add("button");
  orderLink.href = "kontak.html";
  orderLink.textContent = "Order";

  actions.append(orderLink);
  card.append(category, title, description, price, stock, actions);

  return card;
}

/**
 * Renders the featured commissions summary line.
 */
function renderFeaturedSummary(items) {
  if (!produkUnggulan) return;
  const featuredItems = items.filter((item) => item.featured);

  if (featuredItems.length === 0) {
    produkUnggulan.textContent = "No featured commissions available right now.";
    return;
  }

  const labels = featuredItems.map((item) => `${item.name} (${item.category})`);
  produkUnggulan.textContent = `Featured commissions: ${labels.join(", ")}`;
}

/**
 * Renders filtered product cards or the empty state into the grid.
 */
function renderProducts(items) {
  if (!produkGrid || !produkRingkasan) return;

  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState(activeCategory));
    produkRingkasan.textContent = "0 items found.";
    const emptyStatusMessage =
      products.length === 0
        ? "Request succeeded, but catalog data is empty."
        : `No items found in "${activeCategory}".`;
    setStatus("empty", emptyStatusMessage);
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent = `${items.length} items displayed.`;
}

/**
 * Filters fetched products by category and updates the rendered grid.
 */
function applyFilter(category) {
  activeCategory = category;
  const isAll = category === "All" || category === "Semua";
  const filtered = isAll
    ? products
    : products.filter((product) => product.category === category);

  renderProducts(filtered);

  if (filtered.length > 0) {
    const message = isAll
      ? `${products.length} commission items loaded.`
      : `${filtered.length} of ${products.length} items displayed.`;
    setStatus("success", message);
  }
}

/**
 * Fetches catalog data from JSON and handles loading, success, empty, and error states.
 */
async function loadProducts() {
  if (!catalogStatus || !produkGrid || !produkRingkasan) return;

  try {
    setStatus("loading", "Loading catalog data...");
    produkGrid.replaceChildren(
      createStateMessage("loading-state", "Loading commission catalog...")
    );

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid catalog format: expected a JSON array.");
    }

    products = data;
    renderFeaturedSummary(products);
    applyFilter(activeCategory);
  } catch (error) {
    setStatus("error", `Failed to load catalog: ${error.message}`);
    produkRingkasan.textContent = "Unable to load catalog items.";
    if (produkUnggulan) {
      produkUnggulan.textContent = "Featured commissions unavailable.";
    }
    produkGrid.replaceChildren(
      createStateMessage(
        "error-state",
        `Failed to load catalog data (${error.message}).`
      )
    );
  }
}

tombolFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    event.currentTarget.classList.add("is-active");
    applyFilter(event.currentTarget.dataset.filter ?? "All");
  });
});

loadProducts();
