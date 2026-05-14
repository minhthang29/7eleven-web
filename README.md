# 7-Eleven Manager - Quản lý cửa hàng tiện lợi

Dự án quản lý sản phẩm và đơn hàng cho hệ thống cửa hàng 7-Eleven, được xây dựng với kiến trúc hiện đại, giao diện cao cấp và hỗ trợ Docker toàn diện.

## 🚀 Tính năng chính
- **Admin**: Quản lý sản phẩm (Thêm, Sửa, Xóa mềm, Khôi phục), Quản lý đơn hàng.
- **User**: Xem danh mục sản phẩm, Giỏ hàng thông minh, Đặt hàng trực tuyến.
- **UI/UX**: Giao diện Premium, hiệu ứng Glassmorphism, thông báo Toast, Modal xác nhận chuyên nghiệp.
- **Tiền tệ**: Hỗ trợ định dạng VNĐ chuẩn.

## 🛠 Công nghệ sử dụng
- **Backend**: Java Spring Boot, MongoDB.
- **Frontend**: React (TypeScript), Vite, Vanilla CSS.
- **DevOps**: Docker, Docker Compose.

## 📦 Hướng dẫn cài đặt và khởi chạy

Dự án đã được container hóa toàn bộ, bạn chỉ cần có **Docker Desktop** để chạy.

1. **Khởi động ứng dụng**:
   Mở terminal tại thư mục gốc và chạy lệnh:
   ```bash
   docker-compose up --build
   ```

2. **Truy cập ứng dụng**:
   - **Giao diện Người dùng (User)**: [http://localhost:3000](http://localhost:3000)
   - **Giao diện Quản trị (Admin)**: [http://localhost:3000/admin/products](http://localhost:3000/admin/products)
   - **API Backend**: [http://localhost:8081/api](http://localhost:8081/api)

## 📝 Lưu ý
- Đảm bảo các cổng `3000`, `8081` và `27017` không bị chiếm dụng bởi ứng dụng khác trước khi khởi chạy.
- Dữ liệu sẽ được lưu trữ bền vững thông qua Docker Volumes.
