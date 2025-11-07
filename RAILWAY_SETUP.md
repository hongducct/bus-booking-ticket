# Railway Backend Setup

Backend đã được deploy thành công trên Railway tại:
**https://bus-booking-ticket-nest-production.up.railway.app**

## Cấu hình Frontend

### 1. Tạo file `.env` trong thư mục root của frontend:

```env
VITE_API_URL=https://bus-booking-ticket-nest-production.up.railway.app/api
```

### 2. Hoặc nếu muốn dùng local backend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Restart dev server sau khi tạo file `.env`:

```bash
npm run dev
```

## API Endpoints

- **Stations**: `GET /api/stations`
- **Search Trips**: `GET /api/trips/search?from=...&to=...&date=...`
- **Trip Details**: `GET /api/trips/:id`
- **Trip Seats**: `GET /api/trips/:id/seats`
- **Create Booking**: `POST /api/bookings`
- **Search Booking**: `GET /api/bookings/search?query=...`
- **Cancel Booking**: `PUT /api/bookings/:id/cancel`
- **Popular Routes**: `GET /api/stations/popular-routes`

## Swagger Documentation

Truy cập: https://bus-booking-ticket-nest-production.up.railway.app/api/docs

## Lưu ý

- File `.env` đã được thêm vào `.gitignore` để không commit lên git
- Frontend sẽ tự động fallback về Railway URL nếu không có file `.env`
- Đảm bảo CORS đã được cấu hình đúng trên backend

