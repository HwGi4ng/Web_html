// =========================================================
// Veltra Atelier – script.js
// Mỗi phần bên dưới là một "component" độc lập:
// Sparkle, Outfit, Router (menu), ProductCard + SearchBar,
// FilterPanel, VoucherPanel, Cart.
// =========================================================


// ===== Sparkle: ngôi sao lấp lánh theo chuột (màu thương hiệu) =====

const SPARKLE_SHAPES = ["✦", "✧", "★"];
const SPARKLE_COLORS = ["#0B7352", "#0A4A37", "#053A2B", "#B9D9A0"]; // Green, Forest 2, Forest, Sage
const SPARKLE_DELAY = 40; // tối thiểu 40ms mới tạo 1 ngôi sao
let lastSparkle = 0;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createSparkle(x, y) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = pickRandom(SPARKLE_SHAPES);
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";
  sparkle.style.color = pickRandom(SPARKLE_COLORS);
  sparkle.style.fontSize = 10 + Math.random() * 14 + "px";
  sparkle.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");
  document.body.appendChild(sparkle);
  sparkle.addEventListener("animationend", () => sparkle.remove());
}

document.addEventListener("pointermove", (event) => {
  const now = Date.now();
  if (now - lastSparkle < SPARKLE_DELAY) return;
  lastSparkle = now;
  createSparkle(event.clientX, event.clientY);
});


// ===== Outfit: "Hôm nay mặc gì?" =====

const OUTFIT = {
  "Áo": ["Áo len cổ lọ màu be", "Áo sơ mi trắng oversize", "Áo thun basic màu kem", "Áo khoác jean bạc màu", "Áo cardigan xanh rêu"],
  "Quần / Váy": ["Quần jean ống rộng", "Chân váy xếp ly", "Quần tây màu nâu", "Quần short kaki", "Váy midi hoa nhí"],
  "Giày": ["Sneaker trắng", "Boots da nâu", "Giày lười đen", "Sandal quai mảnh", "Giày búp bê mũi tròn"],
  "Phụ kiện": ["Mũ bucket", "Túi tote vải", "Kính râm gọng tròn", "Khăn lụa nhỏ", "Đồng hồ dây da"],
};

const OUTFIT_COMMENTS = [
  "Thanh lịch mà vẫn thoải mái – đúng chất Veltra.",
  "Hôm nay là buổi trình diễn của riêng bạn.",
  "Đơn giản nhưng đầy cuốn hút.",
  "Tự tin bước ra phố thôi!",
  "Phối thế này thì ai cũng phải ngoái nhìn.",
];

const outfitButton = document.getElementById("outfit-button");
const outfitResult = document.getElementById("outfit-result");

outfitButton.addEventListener("click", () => {
  const items = Object.entries(OUTFIT)
    .map(([type, choices]) => `<li><strong>${type}:</strong> ${pickRandom(choices)}</li>`)
    .join("");
  outfitResult.innerHTML = `<ul>${items}</ul><p class="outfit-comment">${pickRandom(OUTFIT_COMMENTS)}</p>`;

  // chạy lại hiệu ứng "nảy" mỗi lần bấm
  outfitResult.classList.remove("pop");
  void outfitResult.offsetWidth;
  outfitResult.classList.add("pop");
});


// ===== Router: chuyển trang bằng menu sidebar =====
// Mỗi mục menu là link "#ten-trang"; nút Back của trình duyệt cũng dùng được.

const VIEWS = ["trang-chu", "quan-ao", "phu-kien", "giay-dep"];

function showView() {
  const hash = location.hash.slice(1);
  const current = VIEWS.includes(hash) ? hash : "trang-chu";

  VIEWS.forEach((view) => {
    document.getElementById("view-" + view).hidden = view !== current;
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.dataset.view === current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", showView);
showView();


// ===== Dữ liệu sản phẩm =====
// Thêm sản phẩm: thêm 1 dòng ở đây và ảnh vào images/products/<id>.jpg

const COLORS = {
  kem:   { label: "Kem",   hex: "#EFE6D2" },
  trang: { label: "Trắng", hex: "#FFFFFF" },
  den:   { label: "Đen",   hex: "#1F1F1F" },
  cam:   { label: "Cam đất", hex: "#B8643F" },
  xanh:  { label: "Xanh denim", hex: "#4A6E8F" },
  hong:  { label: "Hồng",  hex: "#E8B4A6" },
};

const PRODUCTS = [
  { id: "ao-len-moc",    name: "Áo choàng len móc",     price: 359000, type: "len",   isNew: true,  color: "kem",   sizes: ["S", "M", "L"],       alt: "Áo choàng len móc màu kem treo trên móc gỗ" },
  { id: "ao-thun-trang", name: "Áo thun trắng basic",   price: 149000, type: "thun",  isNew: false, color: "trang", sizes: ["S", "M", "L", "XL"], alt: "Người mặc áo thun trắng trơn" },
  { id: "ao-khoac-da",   name: "Áo khoác da biker",     price: 899000, type: "khoac", isNew: false, color: "den",   sizes: ["M", "L", "XL"],      alt: "Áo khoác da đen kiểu biker treo trên móc" },
  { id: "ao-bomber",     name: "Áo bomber cam đất",     price: 549000, type: "khoac", isNew: true,  color: "cam",   sizes: ["S", "M", "L"],       alt: "Áo bomber màu cam đất treo trên móc" },
  { id: "so-mi-denim",   name: "Sơ mi denim chấm bi",   price: 329000, type: "somi",  isNew: false, color: "xanh",  sizes: ["S", "M", "L", "XL"], alt: "Áo sơ mi denim xanh họa tiết chấm nhỏ treo trên tường" },
  { id: "quan-jogger",   name: "Quần jogger hồng phấn", price: 279000, type: "quan",  isNew: true,  color: "hong",  sizes: ["S", "M"],            alt: "Quần jogger màu hồng phấn bo gấu" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// 359000 -> "359.000đ"
function formatPrice(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

// Bỏ dấu tiếng Việt để tìm "ao khoac" vẫn ra "Áo khoác"
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}


// ===== ProductCard + SearchBar + FilterPanel =====

const grid = document.getElementById("product-grid");
const noResult = document.getElementById("no-result");
const searchInput = document.getElementById("search");
const filterForm = document.getElementById("filter-form");
const colorOptions = document.getElementById("color-options");

let selectedId = null;                       // sản phẩm đang chọn (để xem voucher)
let activeFilter = { sizes: [], colors: [] }; // bộ lọc đã bấm "Áp dụng"

// Tạo các ô chọn màu từ dữ liệu COLORS
colorOptions.innerHTML = Object.entries(COLORS)
  .map(
    ([key, c]) => `
    <label class="chip">
      <input type="checkbox" name="color" value="${key}">
      <span><i class="swatch" style="background:${c.hex}"></i>${c.label}</span>
    </label>`
  )
  .join("");

function productCard(p) {
  return `
    <article class="product-card${p.id === selectedId ? " selected" : ""}">
      <button class="product-select" data-id="${p.id}" aria-pressed="${p.id === selectedId}">
        <img src="images/products/${p.id}.jpg" alt="${p.alt}" loading="lazy" width="400" height="400">
        <span class="name">${p.name}${p.isNew ? '<span class="tag">Mới</span>' : ""}</span>
        <span class="price">${formatPrice(p.price)}</span>
      </button>
      <button class="add-to-cart" data-id="${p.id}" aria-label="Thêm ${p.name} vào giỏ">+</button>
    </article>`;
}

function renderProducts() {
  const keyword = normalize(searchInput.value);
  const { sizes, colors } = activeFilter;

  const list = PRODUCTS.filter(
    (p) =>
      normalize(p.name).includes(keyword) &&
      (sizes.length === 0 || p.sizes.some((s) => sizes.includes(s))) &&
      (colors.length === 0 || colors.includes(p.color))
  );

  grid.innerHTML = list.map(productCard).join("");
  noResult.hidden = list.length > 0;
}

grid.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-to-cart");
  if (addButton) {
    addToCart(addButton.dataset.id, addButton);
    return;
  }
  const selectButton = event.target.closest(".product-select");
  if (selectButton) {
    selectedId = selectButton.dataset.id;
    renderProducts();
    renderVouchers();
    // giữ focus trên thẻ vừa chọn (cho người dùng bàn phím)
    grid.querySelector(`.product-select[data-id="${selectedId}"]`)?.focus();
  }
});

// Gõ vào ô tìm kiếm -> chuyển sang trang Quần áo và lọc ngay
searchInput.addEventListener("input", () => {
  if (location.hash !== "#quan-ao") location.hash = "#quan-ao";
  renderProducts();
});

// Bấm "Áp dụng" -> lọc theo size và màu đã chọn
filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(filterForm);
  activeFilter = { sizes: data.getAll("size"), colors: data.getAll("color") };
  renderProducts();
});

// Bấm "Xóa lọc" -> bỏ chọn hết và hiện lại toàn bộ sản phẩm
filterForm.addEventListener("reset", () => {
  activeFilter = { sizes: [], colors: [] };
  renderProducts();
});


// ===== VoucherPanel =====
// appliesTo: sản phẩm nào dùng được; discount: số tiền được giảm

const VOUCHERS = [
  { code: "VELTRA10",  desc: "Giảm 10% cho mọi sản phẩm",            appliesTo: () => true,                                    discount: (p) => Math.round(p.price * 0.1) },
  { code: "NEW15",     desc: "Giảm 15% cho hàng mới về",              appliesTo: (p) => p.isNew,                                discount: (p) => Math.round(p.price * 0.15) },
  { code: "AOKHOAC50", desc: "Giảm 50.000đ cho áo khoác",             appliesTo: (p) => p.type === "khoac",                     discount: () => 50000 },
  { code: "BASIC20",   desc: "Giảm 20% cho áo thun và sơ mi",         appliesTo: (p) => p.type === "thun" || p.type === "somi", discount: (p) => Math.round(p.price * 0.2) },
  { code: "FREESHIP",  desc: "Miễn phí giao hàng cho sản phẩm từ 300.000đ", appliesTo: (p) => p.price >= 300000,              discount: () => 0 },
];

const voucherList = document.getElementById("voucher-list");

function renderVouchers() {
  const product = findProduct(selectedId);

  if (!product) {
    voucherList.innerHTML = `<p class="voucher-hint">Bấm vào một sản phẩm để xem các voucher dùng được.</p>`;
    return;
  }

  const usable = VOUCHERS.filter((v) => v.appliesTo(product)).sort(
    (a, b) => b.discount(product) - a.discount(product)
  );

  const cards = usable
    .map((v, index) => {
      const off = v.discount(product);
      const isBest = index === 0 && off > 0;
      const priceLine =
        off > 0
          ? `Còn <strong>${formatPrice(product.price - off)}</strong> <s>${formatPrice(product.price)}</s>`
          : `Giá giữ nguyên, miễn phí giao hàng`;
      return `
        <div class="voucher${isBest ? " best" : ""}">
          ${isBest ? '<span class="badge">Tốt nhất</span>' : ""}
          <div class="code">${v.code}</div>
          <p class="desc">${v.desc}</p>
          <p class="final-price">${priceLine}</p>
          <button class="btn-primary copy-button" data-code="${v.code}">Copy mã</button>
        </div>`;
    })
    .join("");

  voucherList.innerHTML = `<p class="voucher-product">Cho: ${product.name}</p>${cards}`;
}

voucherList.addEventListener("click", (event) => {
  const button = event.target.closest(".copy-button");
  if (!button) return;
  const code = button.dataset.code;
  // mở file trực tiếp (không qua https) thì trình duyệt có thể không cho copy
  const copying = navigator.clipboard
    ? navigator.clipboard.writeText(code)
    : Promise.reject(new Error("no clipboard"));
  copying
    .then(() => (button.textContent = "Đã copy ✓"))
    .catch(() => (button.textContent = "Mã: " + code))
    .finally(() => setTimeout(() => (button.textContent = "Copy mã"), 1500));
});


// ===== Cart: giỏ hàng =====
// Giỏ được nhớ trong trình duyệt của người xem (localStorage).

const CART_KEY = "veltra-cart";
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    // trình duyệt chặn lưu (tab ẩn danh...) thì giỏ chỉ sống tới khi tải lại trang
  }
}

let cart = loadCart(); // { "ao-bomber": 2, ... }

function addToCart(id, button) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();

  cartCount.classList.remove("bump");
  void cartCount.offsetWidth;
  cartCount.classList.add("bump");

  if (button) {
    button.textContent = "✓";
    setTimeout(() => (button.textContent = "+"), 800);
  }
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart).filter(([id]) => findProduct(id));
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + findProduct(id).price * qty, 0);

  cartCount.textContent = count;
  cartCount.hidden = count === 0;
  cartButton.setAttribute("aria-label", `Giỏ hàng, ${count} sản phẩm`);

  cartItems.innerHTML = entries
    .map(([id, qty]) => {
      const p = findProduct(id);
      return `
        <li class="cart-item">
          <img src="images/products/${p.id}.jpg" alt="">
          <div>
            <div class="item-name">${p.name}</div>
            <div class="item-price">${formatPrice(p.price * qty)}</div>
          </div>
          <div class="qty">
            <button class="icon-button" data-id="${id}" data-delta="-1" aria-label="Bớt 1 ${p.name}">−</button>
            <span>${qty}</span>
            <button class="icon-button" data-id="${id}" data-delta="1" aria-label="Thêm 1 ${p.name}">+</button>
          </div>
        </li>`;
    })
    .join("");

  cartEmpty.hidden = entries.length > 0;
  cartTotal.textContent = formatPrice(total);
}

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delta]");
  if (!button) return;
  changeQty(button.dataset.id, Number(button.dataset.delta));
});

cartButton.addEventListener("click", () => cartDialog.showModal());
document.getElementById("cart-close").addEventListener("click", () => cartDialog.close());

// bấm ra vùng tối bên ngoài cũng đóng giỏ
cartDialog.addEventListener("click", (event) => {
  if (event.target !== cartDialog) return;
  const box = cartDialog.getBoundingClientRect();
  const outside =
    event.clientX < box.left || event.clientX > box.right ||
    event.clientY < box.top || event.clientY > box.bottom;
  if (outside) cartDialog.close();
});


// ===== Khởi động =====
renderProducts();
renderVouchers();
renderCart();
