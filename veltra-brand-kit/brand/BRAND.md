# VELTRA Atelier: hướng dẫn nhận diện

Phương án đã chốt: **VELTRA kiểu B, chữ ký thanh lịch**. Logo gồm chữ "Veltra" viết tay (font Pinyon Script), chữ ATELIER giãn rộng (font Poppins) và huy hiệu oval.

## File logo (`logo/`)

| File | Dùng ở đâu |
|---|---|
| `veltra-wordmark.svg` | Logo chính trên nền sáng (header, email, hoá đơn) |
| `veltra-wordmark-light.svg` | Logo trên nền tối (sidebar xanh, footer) |
| `veltra-emblem.svg` | Huy hiệu oval cho tem nhãn, hộp quà, trang giới thiệu |
| `veltra-monogram.svg` | Avatar mạng xã hội, icon app |
| `favicon.svg` | Biểu tượng trên tab trình duyệt |

> **Lưu ý kỹ thuật:** chữ trong các file SVG vẫn là chữ thật và cần tải font từ Google Fonts. Trước khi đưa lên production, hãy chuyển chữ thành nét vẽ (outline/path) để logo hiển thị đúng ở mọi nơi, kể cả khi nhúng bằng `<img>`.

## Màu sắc

| Tên | Mã | Vai trò |
|---|---|---|
| Lime | `#E5FCC2` | Nền trang, chữ trên nền tối |
| Forest | `#053A2B` | Chữ chính, thẻ sản phẩm, vòng tròn trang trí |
| Forest 2 | `#0A4A37` | Ô nền tối phụ |
| Green | `#0B7352` | Sidebar, nút chính |
| Gray | `#C8D0D9` | Ô tìm kiếm, panel, nút phụ |
| Sage | `#B9D9A0` | Chữ phụ trên nền tối |

Các cặp màu chữ/nền đạt chuẩn tương phản: Forest trên Lime, Lime trên Forest, Trắng trên Green, Forest trên Gray. **Không** đặt chữ Forest lên nền Green.

## Font

- **Pinyon Script**: chỉ dùng cho logo hoặc tiêu đề rất lớn (≥ 48px). Không dùng cho chữ nội dung.
- **Poppins** (400/500/600/700): toàn bộ giao diện, hỗ trợ đầy đủ tiếng Việt.

## Quy tắc dùng logo

- Logo chữ phải rộng tối thiểu **120px** trên web; nhỏ hơn thì dùng monogram.
- Chừa khoảng trống quanh logo ít nhất bằng chiều cao chữ "V".
- Không kéo méo, không đổi màu ngoài bảng màu, không đổ bóng.

## Bố cục website (theo wireframe đã duyệt)

- **Nền:** Lime, có 2 vòng tròn Forest trang trí: một vòng lớn ở góc trên trái (phía sau sidebar), một vòng lớn hơn ở góc dưới phải.
- **Sidebar trái** (rộng ~220–240px, nền Green, bo 16px): logo `veltra-wordmark-light.svg` → ảnh đại diện tròn (nền Gray) → menu: Trang chủ, Quần áo, Phụ kiện, Giày dép. Mục đang chọn có nền Lime và "lòi" ra mép phải sidebar; các mục khác nền Gray, bo 10px.
- **Thanh trên** (nền Gray, bo 16px): ô tìm kiếm có icon kính lúp, nút giỏ hàng vuông 44px nền Forest.
- **Khu sản phẩm** (panel Gray, bo 16px): lưới 3 cột × 2 hàng; mỗi thẻ nền Forest, bo 16px, gồm ảnh, tên, giá và nút "+" tròn nền Lime.
- **Cột phải** (panel Gray, bo 16px): Bộ lọc gồm Size (S/M/L/XL), Màu, nút "Áp dụng" nền Green.
- **Responsive:** trên điện thoại sidebar xếp lên trên, cột lọc xuống dưới, lưới sản phẩm còn 1–2 cột. Mọi nút có vùng bấm ≥ 44px.
