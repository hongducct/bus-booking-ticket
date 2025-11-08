# Hướng dẫn triển khai các tính năng mới

## Backend

### 1. Chạy Migration
```bash
cd booking-bus-ticket-nest
npm run migration:run
```

### 2. Tạo Admin User (tùy chọn)
Bạn có thể tạo admin user thông qua API hoặc seed script.

### 3. Environment Variables
Thêm vào `.env`:
```
JWT_SECRET=your-secret-key-change-in-production
```

## Frontend

### 1. Cài đặt dependencies
```bash
cd "Website Bán Vé Xe Khách"
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Cập nhật App.tsx
Cần wrap App với providers và thêm routes:

```tsx
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Trong App component, wrap với providers:
<AuthProvider>
  <ThemeProvider>
    <Router>
      {/* Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrderManagementPage />
        </ProtectedRoute>
      } />
    </Router>
  </ThemeProvider>
</AuthProvider>
```

### 3. Cập nhật Header
Thêm user menu, theme switcher, và language switcher vào header.

### 4. Cập nhật CheckoutPage
Đảm bảo email và phone được yêu cầu khi đặt vé (guest booking).

## Tính năng đã implement

✅ Backend:
- User entity với roles (user/admin)
- JWT authentication
- Role-based access control
- Booking với userId (optional cho guest)
- Filter bookings theo userId/email

✅ Frontend:
- AuthContext và AuthProvider
- ThemeProvider (light/dark/system)
- i18n setup (vi/en)
- Login/Register pages
- ProtectedRoute component
- API với JWT token support

## Cần hoàn thiện

1. Cập nhật App.tsx với providers và routes
2. Thêm theme/language switcher vào header
3. Cập nhật CheckoutPage để yêu cầu email/phone
4. Test tất cả các tính năng

