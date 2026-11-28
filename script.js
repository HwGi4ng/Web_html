// Vệt lấp lánh theo chuột: di chuột (hoặc chạm trên điện thoại)
// sẽ tạo ra các ngôi sao nhiều màu bay lên rồi mờ dần.

const SHAPES = ["✦", "✧", "★", "✨", "❤"]; // các hình ngôi sao có thể xuất hiện
const DELAY = 40; // tối thiểu 40ms mới tạo 1 ngôi sao, tránh tạo quá nhiều
let lastTime = 0;

function createSparkle(x, y) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";

  // Chọn ngẫu nhiên hình, màu, kích thước và hướng bay
  sparkle.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";
  sparkle.style.color = `hsl(${Math.random() * 360}, 90%, 60%)`;
  sparkle.style.fontSize = 12 + Math.random() * 16 + "px";
  sparkle.style.setProperty("--dx", (Math.random() - 0.5) * 80 + "px");

  document.body.appendChild(sparkle);

  // Bay xong thì xóa khỏi trang để không bị đầy bộ nhớ
  sparkle.addEventListener("animationend", () => sparkle.remove());
}

document.addEventListener("pointermove", (event) => {
  const now = Date.now();
  if (now - lastTime < DELAY) return;
  lastTime = now;
  createSparkle(event.clientX, event.clientY);
});


// ===== Tính năng "Hôm nay mặc gì?" =====
// Bấm nút để chọn ngẫu nhiên 1 món từ mỗi danh sách bên dưới.

const OUTFIT = {
  "👕 Áo": ["Áo len cổ lọ màu be", "Áo sơ mi trắng oversize", "Áo thun in hình mèo", "Áo khoác jean bạc màu", "Áo hoodie xanh pastel"],
  "👖 Quần / Váy": ["Quần jean ống rộng", "Chân váy xếp ly", "Quần tây màu nâu", "Quần short kaki", "Váy midi hoa nhí"],
  "👟 Giày": ["Sneaker trắng", "Boots da nâu", "Giày lười đen", "Sandal quai mảnh", "Dép tổ ong (rất tự tin)"],
  "👜 Phụ kiện": ["Mũ bucket", "Túi tote vải", "Kính râm tròn", "Khăn lụa nhỏ", "Đồng hồ dây da"],
};

const COMMENTS = [
  "Ra đường là có người xin info! 😎",
  "Đẹp tới mức gương cũng phải ngại. 🪞",
  "Hahaha, chuẩn không cần chỉnh! 😂",
  "Mặc vào là tự tin x100. 💪",
  "Phối thế này thì crush phải ngoái lại. 💘",
];

// Lấy ngẫu nhiên 1 phần tử trong mảng
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const outfitButton = document.getElementById("outfit-button");
const outfitResult = document.getElementById("outfit-result");

outfitButton.addEventListener("click", () => {
  // Tạo danh sách các món đồ
  const items = Object.entries(OUTFIT)
    .map(([type, choices]) => `<li><strong>${type}:</strong> ${pickRandom(choices)}</li>`)
    .join("");

  outfitResult.innerHTML = `<ul>${items}</ul><p class="outfit-comment">${pickRandom(COMMENTS)}</p>`;

  // Chạy lại hiệu ứng "nảy" mỗi lần bấm
  outfitResult.classList.remove("pop");
  void outfitResult.offsetWidth; // mẹo nhỏ để trình duyệt reset animation
  outfitResult.classList.add("pop");
});


// ===== Chuyển trang bằng menu bên trái =====
// Mỗi mục menu là 1 link "#ten-trang". Khi địa chỉ đổi, hiện đúng phần đó
// và ẩn các phần còn lại. Nút Back của trình duyệt cũng dùng được.

const VIEWS = ["trang-chu", "quan-ao", "phu-kien", "giay"];

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


// ===== Sản phẩm =====
// Muốn thêm sản phẩm: thêm 1 dòng vào danh sách này (và ảnh vào images/products/).

const PRODUCTS = [
  { id: "ao-len-moc",    name: "Áo choàng len móc",    price: 359000, type: "len",    isNew: true,  alt: "Áo choàng len móc màu kem treo trên móc gỗ" },
  { id: "ao-thun-trang", name: "Áo thun trắng basic",  price: 149000, type: "thun",   isNew: false, alt: "Người mặc áo thun trắng trơn" },
  { id: "ao-khoac-da",   name: "Áo khoác da biker",    price: 899000, type: "khoac",  isNew: false, alt: "Áo khoác da đen kiểu biker treo trên móc" },
  { id: "ao-bomber",     name: "Áo bomber cam đất",    price: 549000, type: "khoac",  isNew: true,  alt: "Áo bomber màu cam đất treo trên móc" },
  { id: "so-mi-denim",   name: "Sơ mi denim chấm bi",  price: 329000, type: "somi",   isNew: false, alt: "Áo sơ mi denim xanh họa tiết chấm nhỏ treo trên tường" },
  { id: "quan-jogger",   name: "Quần jogger hồng phấn", price: 279000, type: "quan",  isNew: true,  alt: "Quần jogger màu hồng phấn bo gấu" },
];

// ===== Voucher =====
// appliesTo: sản phẩm nào được dùng voucher này
// discount: số tiền được giảm cho sản phẩm đó

const VOUCHERS = [
  {
    code: "HAHA10",
    desc: "Giảm 10% cho mọi sản phẩm",
    appliesTo: () => true,
    discount: (p) => Math.round(p.price * 0.1),
  },
  {
    code: "NEW15",
    desc: "Giảm 15% cho hàng mới về",
    appliesTo: (p) => p.isNew,
    discount: (p) => Math.round(p.price * 0.15),
  },
  {
    code: "AOKHOAC50",
    desc: "Giảm 50.000đ cho áo khoác",
    appliesTo: (p) => p.type === "khoac",
    discount: () => 50000,
  },
  {
    code: "BASIC20",
    desc: "Giảm 20% cho áo thun và sơ mi",
    appliesTo: (p) => p.type === "thun" || p.type === "somi",
    discount: (p) => Math.round(p.price * 0.2),
  },
  {
    code: "FREESHIP",
    desc: "Miễn phí giao hàng cho sản phẩm từ 300.000đ",
    appliesTo: (p) => p.price >= 300000,
    discount: () => 0,
  },
];

const grid = document.getElementById("product-grid");
const noResult = document.getElementById("no-result");
const voucherList = document.getElementById("voucher-list");
const searchInput = document.getElementById("search");
let selectedId = null; // sản phẩm đang được chọn

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

function renderProducts() {
  const keyword = normalize(searchInput.value);
  const list = PRODUCTS.filter((p) => normalize(p.name).includes(keyword));

  grid.innerHTML = list
    .map(
      (p) => `
      <button class="product-card" data-id="${p.id}" aria-pressed="${p.id === selectedId}">
        <img src="images/products/${p.id}.jpg" alt="${p.alt}" loading="lazy">
        <span class="name">${p.name}${p.isNew ? " 🆕" : ""}</span>
        <span class="price">${formatPrice(p.price)}</span>
      </button>`
    )
    .join("");

  noResult.hidden = list.length > 0;
}

function renderVouchers() {
  const product = PRODUCTS.find((p) => p.id === selectedId);

  if (!product) {
    voucherList.innerHTML = `<p class="voucher-hint">👆 Bấm vào một sản phẩm để xem các voucher dùng được.</p>`;
    return;
  }

  // Lọc voucher dùng được, sắp xếp: giảm nhiều nhất lên đầu
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
          : `Giá giữ nguyên, được miễn phí ship 🚚`;
      return `
        <div class="voucher${isBest ? " best" : ""}">
          ${isBest ? '<span class="badge">Tốt nhất</span>' : ""}
          <div class="code">${v.code}</div>
          <p class="desc">${v.desc}</p>
          <p class="final-price">${priceLine}</p>
          <button class="copy-button" data-code="${v.code}">📋 Copy mã</button>
        </div>`;
    })
    .join("");

  voucherList.innerHTML = `<p class="voucher-product">Cho: ${product.name}</p>${cards}`;
}

// Bấm vào sản phẩm -> chọn sản phẩm đó và hiện voucher
grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;
  selectedId = card.dataset.id;
  renderProducts();
  renderVouchers();
});

// Bấm "Copy mã" -> copy mã voucher vào clipboard
voucherList.addEventListener("click", (event) => {
  const button = event.target.closest(".copy-button");
  if (!button) return;
  const code = button.dataset.code;
  // Một số trình duyệt không có clipboard (ví dụ khi mở file trực tiếp) -> báo lỗi để hiện mã
  const copying = navigator.clipboard
    ? navigator.clipboard.writeText(code)
    : Promise.reject(new Error("no clipboard"));
  copying
    .then(() => {
      button.textContent = "✅ Đã copy!";
    })
    .catch(() => {
      button.textContent = "Mã: " + code; // trình duyệt không cho copy thì hiện mã để tự chép
    })
    .finally(() => {
      setTimeout(() => (button.textContent = "📋 Copy mã"), 1500);
    });
});

// Gõ vào ô tìm kiếm -> chuyển sang trang Quần áo và lọc sản phẩm
searchInput.addEventListener("input", () => {
  if (location.hash !== "#quan-ao") location.hash = "#quan-ao";
  renderProducts();
});

renderProducts();
renderVouchers();
