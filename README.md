# OSS-Project

Demo FE, BE và PostgreSQL để tái hiện lỗi do môi trường local không đồng nhất.

## Test FE khi BE chưa chạy

1. Vào `frontend/` và chạy `npm start`.
2. Mở URL được in trong terminal (mặc định http://localhost:5173; trong Docker là http://localhost:8081).
3. Bấm **GET /api/notes**. FE gửi request tới `http://localhost:3000/api/notes`; khi BE chưa chạy, trang hiển thị lỗi request. Mở Developer Tools → Console để xem chi tiết.

## Test BE khi thiếu database

Vào `backend/` chạy `npm install` rồi `npm start`. Cấu hình local trong `.env` mẫu trỏ PostgreSQL tới `localhost:5433`; nếu DB không chạy tại đó, thư viện PostgreSQL tự in lỗi kết nối.

## Chạy đầy đủ bằng Docker Compose

Cần Docker Desktop đang chạy. Từ thư mục gốc:

```bash
docker compose up --build
```

Compose khởi chạy PostgreSQL 16, backend Node.js 18 và frontend. Mở http://localhost:8081 rồi bấm **GET /api/notes**.

Để dừng, nhấn `Ctrl+C` rồi chạy `docker compose down`. File `.env` bị Git bỏ qua; `.env.example` là cấu hình mẫu cho demo.
