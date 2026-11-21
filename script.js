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
