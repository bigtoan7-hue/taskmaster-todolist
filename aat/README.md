# 🌟 TaskMaster - Ứng Dụng Quản Lý Công Việc Desktop (TodoList)

Ứng dụng quản lý công việc hiện đại, trực quan, tốc độ cao được thiết kế để chạy trực tiếp trên máy tính Windows mà **không cần cài đặt thêm môi trường phức tạp (như Node.js hay Python)**.

---

## 🚀 Cách mở và sử dụng ứng dụng

Bạn có 3 cách rất thuận tiện để mở ứng dụng:

1. **Cách 1 (Khuyên dùng nhất - Chạy như phần mềm Desktop):**
   - Nhấp đúp chuột vào file **`Chay_TodoList.vbs`** hoặc **`Mo_TodoList.bat`**.
   - Ứng dụng sẽ mở ra trong một cửa sổ ứng dụng Desktop riêng biệt, độc lập, không có thanh địa chỉ duyệt web.

2. **Cách 2 (Tạo Shortcut ra ngoài màn hình chính Desktop):**
   - Nhấp đúp vào file **`Tao_Shortcut_Desktop.bat`**. Phím tắt **TaskMaster TodoList** sẽ tự động xuất hiện trên màn hình máy tính của bạn.

3. **Cách 3 (Mở trực tiếp bằng trình duyệt):**
   - Nhấp đúp vào file **`index.html`** để mở bằng bất kỳ trình duyệt nào (Edge, Chrome, Cốc Cốc, Firefox...).

---

## ✨ Các tính năng nổi bật

- 📁 **Quản lý danh mục linh hoạt:**
  - Mặc định có sẵn các danh mục: *Công việc, Cá nhân, Học tập, Mua sắm*.
  - Dễ dàng tạo thêm danh mục mới với bảng chọn màu sắc và biểu tượng riêng.
  - Phân loại và lọc công việc tức thì theo từng danh mục.

- 🏷️ **Gắn nhãn dán (Tags):**
  - Thêm thẻ nhãn cho công việc (ví dụ: `#kế-hoạch`, `#khẩn-cấp`, `#sức-khỏe`).
  - Hỗ trợ nhập nhanh nhãn ngay trong ô thêm nhanh bằng cú pháp `#tennhan`.
  - Bộ lọc đám mây nhãn (Tags cloud) tại thanh điều hướng bên trái.

- ⚡ **Thêm nhanh công việc (Quick Add):**
  - Thanh nhập nhanh trực quan ngay đầu danh sách, cho phép chọn nhanh hạn chót, danh mục, mức ưu tiên chỉ với phím `Enter`.

- 🎯 **Mức độ ưu tiên & Hạn chót (Deadlines):**
  - Đánh dấu 3 cấp độ: **Cao (Đỏ)**, **Trung bình (Vàng)**, **Thấp (Xanh)** với thanh chỉ báo trực quan.
  - Tự động nhận diện công việc: **Hôm nay** và cảnh báo **Quá hạn**.

- 🔍 **Tìm kiếm & Sắp xếp đa năng:**
  - Tìm kiếm theo thời gian thực theo tiêu đề, ghi chú chi tiết, tên danh mục hoặc nhãn dán.
  - Sắp xếp linh hoạt: *Mới nhất, Cũ nhất, Hạn chót gần nhất, Mức độ ưu tiên cao nhất, Tên A-Z*.

- 📊 **Thống kê & Theo dõi tiến độ:**
  - Thanh tiến độ hoàn thành trong ngày hiển thị % trực quan.
  - Thẻ đếm số lượng tổng công việc, cần xử lý, quá hạn và đã hoàn tất.

- 🎨 **Giao diện Hiện đại & Chuyển đổi Dark/Light Mode:**
  - Thiết kế tông màu tinh tế, hiệu ứng vi mô mượt mà, hỗ trợ cả 2 chế độ Sáng và Tối.
  - Hiệu ứng âm thanh nhẹ nhàng (Chime) khi bạn đánh dấu hoàn thành một công việc.

- 💾 **Lưu trữ Cục bộ & Sao lưu an toàn:**
  - Dữ liệu được lưu trữ tự động trên ổ cứng máy tính (`LocalStorage`) của bạn, không lo bị mất khi đóng ứng dụng hay khởi động lại máy tính.
  - Hỗ trợ tính năng **Xuất dữ liệu dự phòng (JSON)** và **Khôi phục dữ liệu** khi bạn muốn chuyển sang máy tính khác.

- ⌨️ **Phím tắt nhanh:**
  - `Ctrl + N` hoặc `Alt + N`: Mở cửa sổ tạo công việc mới.
  - `/`: Đưa con trỏ nhanh vào ô tìm kiếm.
  - `Esc`: Đóng các cửa sổ thông báo/hộp thoại (Modal).
