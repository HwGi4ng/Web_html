// =========================================================
// Veltra Atelier – script.js
// Các "component": Sparkle, Outfit, Router, Shop (ProductCard,
// SearchBar, FilterPanel), Cart, Profile.
// =========================================================


// ===== Tiện ích dùng chung =====

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 359000 -> "359.000đ"
function formatPrice(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

// Bỏ dấu tiếng Việt để tìm "tui xach" vẫn ra "Túi xách"
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Đọc/ghi localStorage an toàn (tab ẩn danh có thể chặn)
function loadJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}


// ===== Sparkle: ngôi sao lấp lánh theo chuột (màu thương hiệu) =====

const SPARKLE_SHAPES = ["✦", "✧", "★"];
const SPARKLE_COLORS = ["#0B7352", "#0A4A37", "#053A2B", "#B9D9A0"];
const SPARKLE_DELAY = 40;
let lastSparkle = 0;

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


// ===== Dữ liệu: danh mục, sản phẩm =====
// Thêm danh mục mới: thêm 1 mục vào CATEGORIES, 1 link trong menu (index.html)
// và các sản phẩm có category tương ứng.
// filters: các nhóm lọc hiện ở cột phải; "order" là thứ tự hiển thị (nếu cần).

const CATEGORIES = {
  "quan-ao": {
    label: "Quần áo",
    filters: [
      { key: "sizes", label: "Size", order: ["S", "M", "L", "XL"] },
      { key: "color", label: "Màu" },
    ],
  },
  "phu-kien": {
    label: "Phụ kiện",
    filters: [
      { key: "kind", label: "Loại" },
      { key: "color", label: "Màu" },
    ],
  },
  "giay-dep": {
    label: "Giày dép",
    filters: [
      { key: "sizes", label: "Size" },
      { key: "color", label: "Màu" },
    ],
  },
  "my-pham": {
    label: "Mỹ phẩm",
    filters: [{ key: "kind", label: "Loại" }],
  },
  "trang-suc": {
    label: "Trang sức",
    filters: [
      { key: "kind", label: "Loại" },
      { key: "material", label: "Chất liệu" },
    ],
  },
};

// Màu: hiện kèm ô màu nhỏ trong bộ lọc
const COLORS = {
  kem:   { label: "Kem",     hex: "#EFE6D2" },
  trang: { label: "Trắng",   hex: "#FFFFFF" },
  den:   { label: "Đen",     hex: "#1F1F1F" },
  xam:   { label: "Xám",     hex: "#8A9099" },
  nau:   { label: "Nâu",     hex: "#7A4A2B" },
  cam:   { label: "Cam đất", hex: "#B8643F" },
  do:    { label: "Đỏ",      hex: "#C0392B" },
  hong:  { label: "Hồng",    hex: "#E8B4A6" },
  vang:  { label: "Vàng",    hex: "#D4B04C" },
  xanh:  { label: "Xanh",    hex: "#4A6E8F" },
};

const SHOE_SIZES = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

// Mỗi sản phẩm: ảnh ở images/products/<id>.jpg
const PRODUCTS = [
  // Quần áo
  { id: "ao-len-moc",    category: "quan-ao", name: "Áo choàng len móc",     price: 359000, type: "len",   isNew: true,  color: "kem",   sizes: ["S", "M", "L"],       alt: "Áo choàng len móc màu kem treo trên móc gỗ" },
  { id: "ao-thun-trang", category: "quan-ao", name: "Áo thun trắng basic",   price: 149000, type: "thun",  isNew: false, color: "trang", sizes: ["S", "M", "L", "XL"], alt: "Người mặc áo thun trắng trơn" },
  { id: "ao-khoac-da",   category: "quan-ao", name: "Áo khoác da biker",     price: 899000, type: "khoac", isNew: false, color: "den",   sizes: ["M", "L", "XL"],      alt: "Áo khoác da đen kiểu biker treo trên móc" },
  { id: "ao-bomber",     category: "quan-ao", name: "Áo bomber cam đất",     price: 549000, type: "khoac", isNew: true,  color: "cam",   sizes: ["S", "M", "L"],       alt: "Áo bomber màu cam đất treo trên móc" },
  { id: "so-mi-denim",   category: "quan-ao", name: "Sơ mi denim chấm bi",   price: 329000, type: "somi",  isNew: false, color: "xanh",  sizes: ["S", "M", "L", "XL"], alt: "Áo sơ mi denim xanh họa tiết chấm nhỏ treo trên tường" },
  { id: "quan-jogger",   category: "quan-ao", name: "Quần jogger hồng phấn", price: 279000, type: "quan",  isNew: true,  color: "hong",  sizes: ["S", "M"],            alt: "Quần jogger màu hồng phấn bo gấu" },

  // Phụ kiện
  { id: "kinh-ram-tron",  category: "phu-kien", name: "Kính râm gọng tròn",     price: 289000,  kind: "Kính",    color: "vang", isNew: true,  alt: "Kính râm gọng tròn mảnh màu vàng, tròng xanh rêu" },
  { id: "mu-luoi-trai",   category: "phu-kien", name: "Mũ lưỡi trai wash",      price: 159000,  kind: "Mũ",      color: "xam",  isNew: false, alt: "Mũ lưỡi trai vải màu xám bạc" },
  { id: "dong-ho-day-da", category: "phu-kien", name: "Đồng hồ dây da tối giản", price: 1290000, kind: "Đồng hồ", color: "nau",  isNew: false, alt: "Tay cầm đồng hồ mặt trắng dây da nâu" },
  { id: "balo-xanh-navy", category: "phu-kien", name: "Balo vải xanh navy",     price: 459000,  kind: "Túi",     color: "xanh", isNew: false, alt: "Balo vải màu xanh navy dựng trên sàn" },
  { id: "tui-xach-do",    category: "phu-kien", name: "Túi xách da đỏ",         price: 989000,  kind: "Túi",     color: "do",   isNew: true,  alt: "Túi xách da màu đỏ cam có quai cầm" },
  { id: "tui-may-cam",    category: "phu-kien", name: "Túi mây quai da",        price: 529000,  kind: "Túi",     color: "cam",  isNew: false, alt: "Túi đan mây màu cam đất với nắp da" },

  // Giày dép
  { id: "sneaker-chunky",   category: "giay-dep", name: "Sneaker đế chunky",          price: 790000,  type: "giay", color: "xam",   sizes: SHOE_SIZES(36, 42), isNew: true,  alt: "Đôi sneaker đế dày phối màu đặt trên bục trắng" },
  { id: "sneaker-trang-be", category: "giay-dep", name: "Sneaker trắng phối be",      price: 650000,  type: "giay", color: "trang", sizes: SHOE_SIZES(36, 43), isNew: false, alt: "Sneaker trắng phối da lộn màu be trên nền cam" },
  { id: "boots-da-nau",     category: "giay-dep", name: "Boots da cổ lửng",           price: 1190000, type: "giay", color: "nau",   sizes: SHOE_SIZES(39, 43), isNew: false, alt: "Đôi boots da nâu sẫm cổ lửng trên nền tối" },
  { id: "cao-got-den",      category: "giay-dep", name: "Giày cao gót mũi nhọn",      price: 690000,  type: "giay", color: "den",   sizes: SHOE_SIZES(35, 39), isNew: true,  alt: "Tay cầm chiếc giày cao gót đen mũi nhọn" },
  { id: "giay-monk-nau",    category: "giay-dep", name: "Giày monk strap da",         price: 1090000, type: "giay", color: "nau",   sizes: SHOE_SIZES(39, 43), isNew: false, alt: "Đôi giày da nâu khóa monk strap trên sàn gỗ" },
  { id: "cao-got-hoa-tiet", category: "giay-dep", name: "Cao gót họa tiết nhiệt đới", price: 750000,  type: "giay", color: "xanh",  sizes: SHOE_SIZES(35, 39), isNew: false, alt: "Đôi giày cao gót họa tiết lá nhiệt đới trên nền xanh" },

  // Mỹ phẩm
  { id: "serum-duong-am",    category: "my-pham", name: "Serum dưỡng ẩm",      price: 420000, kind: "Dưỡng da",   isNew: true,  alt: "Lọ serum thủy tinh trắng nắp vàng trên đá cẩm thạch" },
  { id: "bang-phan-mat",     category: "my-pham", name: "Bảng phấn mắt 6 màu", price: 365000, kind: "Trang điểm", isNew: false, alt: "Tay cầm bảng phấn mắt tông nâu hồng và cọ trang điểm" },
  { id: "tinh-dau-duong-da", category: "my-pham", name: "Tinh dầu dưỡng da",   price: 390000, kind: "Dưỡng da",   isNew: false, alt: "Lọ tinh dầu thủy tinh màu hổ phách trên kệ gỗ" },
  { id: "kem-duong-gel",     category: "my-pham", name: "Kem dưỡng dạng gel",  price: 450000, kind: "Dưỡng da",   isNew: false, alt: "Hai tay cầm hũ kem dưỡng dạng gel màu xanh nhạt" },
  { id: "son-thoi-hong-dat", category: "my-pham", name: "Son thỏi hồng đất",   price: 290000, kind: "Trang điểm", isNew: true,  alt: "Thỏi son màu hồng đất bên cạnh nắp son" },
  { id: "mascara-dai-mi",    category: "my-pham", name: "Mascara dài mi",      price: 250000, kind: "Trang điểm", isNew: false, alt: "Cây mascara và đầu chải trên nền hồng" },

  // Trang sức
  { id: "vong-ngoc-trai",      category: "trang-suc", name: "Vòng cổ ngọc trai",   price: 1450000, kind: "Dây chuyền", material: "Ngọc trai", isNew: false, alt: "Chuỗi vòng cổ ngọc trai trong hộp trang sức" },
  { id: "bong-tai-da-xanh",    category: "trang-suc", name: "Bông tai đá xanh",    price: 890000,  kind: "Bông tai",   material: "Bạc",       isNew: true,  alt: "Đôi bông tai bạc đính đá xanh trên lá cây" },
  { id: "day-chuyen-trai-tim", category: "trang-suc", name: "Dây chuyền trái tim", price: 650000,  kind: "Dây chuyền", material: "Bạc",       isNew: false, alt: "Dây chuyền bạc mặt trái tim đính đá trên nền trắng" },
  { id: "nhan-kim-cuong",      category: "trang-suc", name: "Nhẫn đính đá halo",   price: 1890000, kind: "Nhẫn",       material: "Bạc",       isNew: false, alt: "Nhẫn bạc đính đá kiểu halo trên nền tối" },
  { id: "lac-tay-vang-hong",   category: "trang-suc", name: "Lắc tay vàng hồng",   price: 790000,  kind: "Lắc tay",    material: "Vàng",      isNew: false, alt: "Lắc tay vàng hồng họa tiết đan trên nền hồng" },
  { id: "bong-tai-vang",       category: "trang-suc", name: "Bông tai vàng xoắn",  price: 560000,  kind: "Bông tai",   material: "Vàng",      isNew: true,  alt: "Đôi bông tai vàng xoắn bên viên đá trắng" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// Giá trị của 1 thuộc tính lọc luôn trả về dạng mảng
function valuesOf(product, key) {
  const v = product[key];
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}


// ===== Router: chuyển trang bằng menu sidebar =====

const viewHome = document.getElementById("view-home");
const viewShop = document.getElementById("view-shop");
let currentCategory = null;

function showView() {
  const hash = location.hash.slice(1);
  const category = CATEGORIES[hash] ? hash : null;
  const current = category || "trang-chu";

  viewHome.hidden = Boolean(category);
  viewShop.hidden = !category;

  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.dataset.view === current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (category && category !== currentCategory) {
    currentCategory = category;
    activeFilter = {};
    renderFilters();
    renderProducts();
  }
}


// ===== Shop: ProductCard + SearchBar + FilterPanel =====

const grid = document.getElementById("product-grid");
const noResult = document.getElementById("no-result");
const shopTitle = document.getElementById("shop-title");
const shopCount = document.getElementById("shop-count");
const searchInput = document.getElementById("search");
const filterForm = document.getElementById("filter-form");
const filterGroups = document.getElementById("filter-groups");

let activeFilter = {}; // bộ lọc đã "Áp dụng", ví dụ { sizes: ["M"], color: ["den"] }

function optionLabel(key, value) {
  if (key === "color" && COLORS[value]) {
    return `<i class="swatch" style="background:${COLORS[value].hex}"></i>${COLORS[value].label}`;
  }
  return value;
}

// Tạo các nhóm lọc của danh mục hiện tại, lựa chọn lấy từ chính sản phẩm
function renderFilters() {
  const config = CATEGORIES[currentCategory];
  const products = PRODUCTS.filter((p) => p.category === currentCategory);

  filterGroups.innerHTML = config.filters
    .map(({ key, label, order }) => {
      const found = new Set(products.flatMap((p) => valuesOf(p, key)));
      const options = order
        ? order.filter((o) => found.has(o))
        : [...found].sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));
      const chips = options
        .map(
          (value) => `
          <label class="chip">
            <input type="checkbox" name="${key}" value="${value}">
            <span>${optionLabel(key, value)}</span>
          </label>`
        )
        .join("");
      return `<fieldset><legend>${label}</legend><div class="chips">${chips}</div></fieldset>`;
    })
    .join("");
}

function productCard(p) {
  return `
    <article class="product-card">
      <div class="product-body">
        <img src="images/products/${p.id}.jpg" alt="${p.alt}" loading="lazy" width="400" height="400">
        <span class="name">${p.name}${p.isNew ? '<span class="tag">Mới</span>' : ""}</span>
        <span class="price">${formatPrice(p.price)}</span>
      </div>
      <button class="add-to-cart" data-id="${p.id}" aria-label="Thêm ${p.name} vào giỏ">+</button>
    </article>`;
}

function renderProducts() {
  if (!currentCategory) return;
  const keyword = normalize(searchInput.value);
  let list;

  if (keyword) {
    // Đang tìm kiếm: tìm trong TẤT CẢ danh mục, tạm ẩn bộ lọc
    list = PRODUCTS.filter((p) => normalize(p.name).includes(keyword));
    shopTitle.textContent = `Kết quả cho “${searchInput.value.trim()}”`;
    filterForm.hidden = true;
  } else {
    list = PRODUCTS.filter(
      (p) =>
        p.category === currentCategory &&
        Object.entries(activeFilter).every(
          ([key, chosen]) => chosen.length === 0 || valuesOf(p, key).some((v) => chosen.includes(v))
        )
    );
    shopTitle.textContent = CATEGORIES[currentCategory].label;
    filterForm.hidden = false;
  }

  shopCount.textContent = `${list.length} sản phẩm`;
  grid.innerHTML = list.map(productCard).join("");
  noResult.hidden = list.length > 0;
}

grid.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-to-cart");
  if (addButton) addToCart(addButton.dataset.id, addButton);
});

// Gõ tìm kiếm khi đang ở Trang chủ -> mở trang Quần áo để hiện kết quả
searchInput.addEventListener("input", () => {
  if (!currentCategory || !CATEGORIES[location.hash.slice(1)]) {
    location.hash = "#" + (currentCategory || "quan-ao");
  }
  renderProducts();
});

filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(filterForm);
  activeFilter = {};
  CATEGORIES[currentCategory].filters.forEach(({ key }) => {
    activeFilter[key] = data.getAll(key);
  });
  renderProducts();
});

filterForm.addEventListener("reset", () => {
  activeFilter = {};
  renderProducts();
});


// ===== Cửa sổ bật lên dùng chung (giỏ hàng, hồ sơ) =====

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelectorAll("[data-close]").forEach((button) =>
    button.addEventListener("click", () => dialog.close())
  );
  // bấm ra vùng tối bên ngoài thì đóng
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom;
    if (outside) dialog.close();
  });
});


// ===== Cart: giỏ hàng (nhớ trong trình duyệt của người xem) =====

const CART_KEY = "veltra-cart";
const cartButton = document.getElementById("cart-button");
const cartCount = document.getElementById("cart-count");
const cartDialog = document.getElementById("cart-dialog");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");

let cart = loadJSON(CART_KEY, {});
if (typeof cart !== "object" || Array.isArray(cart)) cart = {};

function addToCart(id, button) {
  cart[id] = (cart[id] || 0) + 1;
  saveJSON(CART_KEY, cart);
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
  saveJSON(CART_KEY, cart);
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


// ===== Home: "Hàng mới về" + gợi ý outfit =====

const newGrid = document.getElementById("new-grid");
const outfitButton = document.getElementById("outfit-button");
const outfitResult = document.getElementById("outfit-result");

// Hàng mới về: ưu tiên mỗi danh mục 1 món, tối đa 6 món
function renderNewArrivals() {
  const fresh = PRODUCTS.filter((p) => p.isNew);
  const picked = [];
  Object.keys(CATEGORIES).forEach((category) => {
    const item = fresh.find((p) => p.category === category);
    if (item) picked.push(item);
  });
  fresh.forEach((p) => {
    if (picked.length < 6 && !picked.includes(p)) picked.push(p);
  });
  newGrid.innerHTML = picked.slice(0, 6).map(productCard).join("");
}

// Mỗi bộ outfit gồm 1 món của từng danh mục dưới đây
const OUTFIT_SLOTS = [
  { label: "Quần áo",   category: "quan-ao" },
  { label: "Giày dép",  category: "giay-dep" },
  { label: "Phụ kiện",  category: "phu-kien" },
  { label: "Trang sức", category: "trang-suc" },
];

const OUTFIT_COMMENTS = [
  "Thanh lịch mà vẫn thoải mái – đúng chất Veltra.",
  "Hôm nay là buổi trình diễn của riêng bạn.",
  "Đơn giản nhưng đầy cuốn hút.",
  "Tự tin bước ra phố thôi!",
  "Phối thế này thì ai cũng phải ngoái nhìn.",
];

let currentOutfit = [];

outfitButton.addEventListener("click", () => {
  currentOutfit = OUTFIT_SLOTS.map((slot) => {
    const options = PRODUCTS.filter((p) => p.category === slot.category);
    // tránh lặp lại đúng món của lần gợi ý trước
    const previous = currentOutfit.find((p) => p.category === slot.category);
    const pool = options.filter((p) => p !== previous);
    return pickRandom(pool.length ? pool : options);
  });

  const total = currentOutfit.reduce((sum, p) => sum + p.price, 0);
  const slots = currentOutfit
    .map(
      (p, i) => `
      <div class="outfit-slot">
        <span class="slot-label">${OUTFIT_SLOTS[i].label}</span>
        ${productCard(p)}
      </div>`
    )
    .join("");

  outfitResult.innerHTML = `
    <div class="outfit-grid">${slots}</div>
    <div class="outfit-footer">
      <p class="outfit-comment">${pickRandom(OUTFIT_COMMENTS)}</p>
      <div class="outfit-buy">
        <span class="outfit-total">Cả bộ: <strong>${formatPrice(total)}</strong></span>
        <button class="btn-primary add-outfit">Thêm cả bộ vào giỏ</button>
      </div>
    </div>`;

  outfitButton.textContent = "✦ Gợi ý bộ khác";

  // chạy lại hiệu ứng "nảy" mỗi lần bấm
  outfitResult.classList.remove("pop");
  void outfitResult.offsetWidth;
  outfitResult.classList.add("pop");
});

// Bấm trên Trang chủ: "+" thêm 1 món, "Thêm cả bộ" thêm cả outfit vào giỏ
viewHome.addEventListener("click", (event) => {
  const addButton = event.target.closest(".add-to-cart");
  if (addButton) {
    addToCart(addButton.dataset.id, addButton);
    return;
  }

  const outfitBuy = event.target.closest(".add-outfit");
  if (outfitBuy) {
    currentOutfit.forEach((p) => addToCart(p.id));
    outfitBuy.textContent = "Đã thêm cả bộ ✓";
    setTimeout(() => (outfitBuy.textContent = "Thêm cả bộ vào giỏ"), 1500);
  }
});


// ===== Profile: avatar + tên người mua (nhớ trong trình duyệt) =====

const PROFILE_KEY = "veltra-profile";
const profileButton = document.getElementById("profile-button");
const profileDialog = document.getElementById("profile-dialog");
const profileForm = document.getElementById("profile-form");
const avatarImg = document.getElementById("avatar-img");
const avatarDefault = document.getElementById("avatar-default");
const greetingName = document.getElementById("greeting-name");
const previewImg = document.getElementById("preview-img");
const previewDefault = document.getElementById("preview-default");
const photoInput = document.getElementById("photo-input");
const photoRemove = document.getElementById("photo-remove");
const nameInput = document.getElementById("name-input");

let profile = loadJSON(PROFILE_KEY, {});
if (typeof profile !== "object" || Array.isArray(profile)) profile = {};
let draftPhoto = null; // ảnh đang chọn trong hộp hồ sơ, chưa bấm Lưu

function showPhoto(img, fallback, photo) {
  if (photo) {
    img.src = photo;
    img.hidden = false;
    fallback.style.display = "none";
  } else {
    img.removeAttribute("src");
    img.hidden = true;
    fallback.style.display = "";
  }
}

function renderProfile() {
  showPhoto(avatarImg, avatarDefault, profile.photo);
  greetingName.textContent = profile.name || "bạn";
  profileButton.setAttribute("aria-label", profile.name ? `Hồ sơ của ${profile.name}` : "Hồ sơ của bạn");
}

profileButton.addEventListener("click", () => {
  draftPhoto = profile.photo || null;
  nameInput.value = profile.name || "";
  showPhoto(previewImg, previewDefault, draftPhoto);
  profileDialog.showModal();
});

// Chọn ảnh -> cắt vuông giữa ảnh, thu nhỏ còn 192px để lưu gọn
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  photoInput.value = "";
  if (!file || !file.type.startsWith("image/")) return;

  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const side = Math.min(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 192;
    canvas.getContext("2d").drawImage(
      image,
      (image.width - side) / 2, (image.height - side) / 2, side, side,
      0, 0, 192, 192
    );
    draftPhoto = canvas.toDataURL("image/jpeg", 0.85);
    showPhoto(previewImg, previewDefault, draftPhoto);
    URL.revokeObjectURL(url);
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
});

photoRemove.addEventListener("click", () => {
  draftPhoto = null;
  showPhoto(previewImg, previewDefault, null);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  profile = { name: nameInput.value.trim(), photo: draftPhoto };
  saveJSON(PROFILE_KEY, profile);
  renderProfile();
  profileDialog.close();
});


// ===== Khởi động =====
window.addEventListener("hashchange", showView);
renderProfile();
renderCart();
renderNewArrivals();
showView();
