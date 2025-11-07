# Hướng dẫn Test API

## 1. Test bằng Browser

Mở browser và truy cập các URL sau:

### Lấy danh sách trạm
```
http://localhost:3000/api/stations
```

### Tìm kiếm chuyến xe
```
http://localhost:3000/api/trips/search?from=Hồ Chí Minh&to=Đà Lạt&date=2025-01-15
```

### Lấy tuyến đường phổ biến
```
http://localhost:3000/api/stations/popular-routes
```

## 2. Test bằng cURL

### Tìm kiếm chuyến xe
```bash
curl "http://localhost:3000/api/trips/search?from=Hồ Chí Minh&to=Đà Lạt&date=2025-01-15"
```

### Lấy danh sách trạm
```bash
curl "http://localhost:3000/api/stations"
```

### Tạo đơn đặt vé (cần tripId và seatId từ API trên)
```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": "YOUR_TRIP_ID",
    "customerName": "Nguyễn Văn A",
    "customerPhone": "0901234567",
    "customerEmail": "test@example.com",
    "seats": [{"seatId": "YOUR_SEAT_ID"}]
  }'
```

## 3. Test bằng Postman

1. Import file `postman_collection.json` vào Postman
2. Đảm bảo backend đang chạy tại `http://localhost:3000`
3. Chạy các requests trong collection

## 4. Test qua Frontend

1. Start backend: `cd booking-bus-ticket-nest && npm run start:dev`
2. Start frontend: `cd "Website Bán Vé Xe Khách" && npm run dev`
3. Mở browser: `http://localhost:5173`
4. Thử tìm kiếm chuyến xe từ trang chủ

## 5. Kiểm tra Database

Sau khi seed, kiểm tra dữ liệu:
```sql
-- Kết nối PostgreSQL
psql -U postgres -d bus_ticket_db

-- Xem số lượng records
SELECT COUNT(*) FROM stations;
SELECT COUNT(*) FROM bus_companies;
SELECT COUNT(*) FROM trips;
SELECT COUNT(*) FROM seats;
```

## Lưu ý

- Đảm bảo backend đang chạy trước khi test
- Đảm bảo đã chạy migrations: `npm run migration:run`
- Đảm bảo đã seed data: `npm run seed`
- Kiểm tra CORS nếu có lỗi khi gọi từ frontend

