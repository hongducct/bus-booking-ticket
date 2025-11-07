# Website Bán Vé Xe Khách

This is a code bundle for Website Bán Vé Xe Khách. The original project is available at https://www.figma.com/design/pXdXXRc0YPEpkANmZIFZoh/Website-B%C3%A1n-V%C3%A9-Xe-Kh%C3%A1ch.

## Backend API

Backend đã được deploy trên Railway tại:
**https://bus-booking-ticket-nest-production.up.railway.app**

API Documentation (Swagger): https://bus-booking-ticket-nest-production.up.railway.app/api/docs

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API URL (Optional)

Tạo file `.env` trong thư mục root:

```env
VITE_API_URL=https://bus-booking-ticket-nest-production.up.railway.app/api
```

Nếu không tạo file `.env`, frontend sẽ tự động dùng Railway URL mặc định.

### 3. Run development server

```bash
npm run dev
```

## Features

- ✅ Tìm kiếm chuyến xe theo điểm đi, điểm đến, ngày đi
- ✅ Lọc chuyến xe theo giá, loại xe, khung giờ
- ✅ Chọn ghế và đặt vé
- ✅ Quản lý đơn hàng
- ✅ Tra cứu đơn hàng
- ✅ Tích hợp với Railway backend API

## API Endpoints

- **Stations**: `GET /api/stations`
- **Search Trips**: `GET /api/trips/search`
- **Trip Details**: `GET /api/trips/:id`
- **Trip Seats**: `GET /api/trips/:id/seats`
- **Create Booking**: `POST /api/bookings`
- **Search Booking**: `GET /api/bookings/search`
- **Cancel Booking**: `PUT /api/bookings/:id/cancel`
- **Popular Routes**: `GET /api/stations/popular-routes`

Xem chi tiết tại [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)
