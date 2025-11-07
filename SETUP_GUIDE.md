# Hướng dẫn Setup - Đăng nhập, Theme, Multi-language

## 1. Cài đặt Dependencies

```bash
cd "Website Bán Vé Xe Khách"
npm install i18next react-i18next i18next-browser-languagedetector
```

## 2. Backend - Chạy Migration

```bash
cd booking-bus-ticket-nest
npm run migration:run
```

Migration sẽ tạo:
- Bảng `users` với các trường: id, email, password, name, phone, role
- Thêm cột `user_id` vào bảng `bookings`

## 3. Backend - Environment Variables

Thêm vào `.env` của backend:
```
JWT_SECRET=your-secret-key-change-in-production-min-32-chars
```

## 4. Tạo Admin User (Tùy chọn)

Bạn có thể tạo admin user thông qua:
- API `/api/auth/register` sau đó update role trong database
- Hoặc tạo seed script

## 5. Test

### Frontend:
1. Chạy `npm run dev`
2. Bạn sẽ thấy:
   - **Theme Switcher** (icon mặt trời/trăng) ở header
   - **Language Switcher** (icon ngôn ngữ) ở header  
   - **User Menu** (avatar hoặc nút đăng nhập) ở header
   - Routes `/login` và `/register` đã hoạt động

### Backend:
1. Chạy `npm run start:dev`
2. Truy cập `http://localhost:3000/api/docs` để test API
3. Test endpoints:
   - `POST /api/auth/register` - Đăng ký
   - `POST /api/auth/login` - Đăng nhập
   - `GET /api/bookings` - Lấy danh sách đơn (cần JWT token)

## Tính năng đã implement

### ✅ Authentication
- Đăng ký/Đăng nhập với email và password
- JWT token authentication
- Protected routes (yêu cầu đăng nhập)
- User context với localStorage persistence

### ✅ Theme (Light/Dark/System)
- Theme switcher trong header
- Tự động detect system preference
- Lưu preference vào localStorage
- Dark mode styles cho tất cả components

### ✅ Multi-language (i18n)
- Hỗ trợ Tiếng Việt và English
- Language switcher trong header
- Tự động detect browser language
- Translation cho tất cả text

### ✅ Role-based Access Control
- User role: `user` hoặc `admin`
- Admin có thể xem tất cả bookings
- User chỉ xem được bookings của mình (theo userId hoặc email)
- Guest booking (không đăng nhập) vẫn hoạt động với email/phone

### ✅ Guest Booking
- Đặt vé không cần đăng nhập
- **Bắt buộc**: Họ tên, Số điện thoại, Email
- Nếu đã đăng nhập, booking sẽ tự động link với user account

## Cách sử dụng

### Đăng ký/Đăng nhập:
1. Click vào nút "Đăng nhập" hoặc "Đăng ký" ở header
2. Điền thông tin và submit
3. Sau khi đăng nhập thành công, bạn sẽ thấy avatar của mình ở header

### Đổi Theme:
1. Click vào icon mặt trời/trăng ở header
2. Chọn: Light, Dark, hoặc System

### Đổi Ngôn ngữ:
1. Click vào icon ngôn ngữ ở header
2. Chọn: Tiếng Việt hoặc English

### Đặt vé (Guest):
1. Không cần đăng nhập
2. Điền đầy đủ: Họ tên, Số điện thoại, Email
3. Đặt vé như bình thường

### Xem đơn hàng:
1. Cần đăng nhập
2. Truy cập `/orders`
3. Chỉ thấy đơn hàng của mình (hoặc tất cả nếu là admin)

## Lưu ý

- JWT token được lưu trong localStorage
- Theme preference được lưu trong localStorage
- Language preference được lưu trong localStorage
- Nếu token hết hạn, user sẽ bị logout tự động

