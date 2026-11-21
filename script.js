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
