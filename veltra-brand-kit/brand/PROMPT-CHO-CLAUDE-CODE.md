Mình vừa thêm thư mục `brand/` vào dự án. Trong đó có bộ nhận diện thương hiệu VELTRA: logo SVG trong `brand/logo/`, design tokens trong `brand/brand.css` và hướng dẫn trong `brand/BRAND.md`. Hãy đọc `brand/BRAND.md` trước, rồi làm lần lượt:

1. **Chuẩn bị logo:** chép các file trong `brand/logo/` vào thư mục tài nguyên tĩnh của dự án (ví dụ `public/logo/` với Next.js/Vite, hoặc `assets/logo/`). Tải font Pinyon Script và Poppins (bản TTF, giấy phép OFL) rồi chuyển toàn bộ chữ trong các SVG thành path. Có thể dùng `opentype.js` hoặc `fonttools`. Giữ nguyên màu và vị trí. Lưu bản đã outline đè lên bản cũ.
2. **Favicon:** từ `favicon.svg` (bản đã outline), tạo `favicon.ico`, `apple-touch-icon.png` (180px), `icon-192.png` và `icon-512.png`, rồi khai báo trong `<head>` hoặc metadata của framework.
3. **Design tokens:** đưa các biến trong `brand/brand.css` vào CSS toàn cục của dự án. Nếu dự án dùng Tailwind thì map chúng vào `theme.extend` (colors, fontFamily, borderRadius). Load font Poppins và Pinyon Script đúng cách theo framework (ví dụ `next/font/google`).
4. **Áp dụng lên website:** dựng lại layout trang danh mục "Quần áo" đúng theo mục "Bố cục website" trong `BRAND.md`, gồm sidebar, thanh tìm kiếm, lưới sản phẩm, bộ lọc và 2 vòng tròn trang trí. Tách thành các component dùng lại được (Sidebar, SearchBar, ProductCard, FilterPanel). Sidebar dùng logo `veltra-wordmark-light.svg`.
5. **Kiểm tra:** chạy dev server, xem ở màn hình desktop (1280px) và điện thoại (390px), kiểm tra độ tương phản chữ và vùng bấm ≥ 44px. Báo cho mình biết những gì đã thay đổi.

Trước khi sửa file, hãy cho mình biết dự án đang dùng framework nào và kế hoạch của bạn.
