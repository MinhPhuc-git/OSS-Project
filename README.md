# OSS-Project

Demo project dùng để minh họa tình huống **“máy tôi chạy được, máy bạn thì không”** và cách Docker Compose giúp nhóm thống nhất môi trường.

## Thành phần

- **Frontend:** trang web nhỏ gửi và hiển thị ghi chú.
- **Backend:** Node.js 18, cung cấp REST API.
- **Database:** PostgreSQL 16, lưu ghi chú.
- **Docker Compose:** khởi chạy toàn bộ dịch vụ với cấu hình chung.

## Chạy bằng Docker (cách dùng chung cho nhóm)

Cần cài Docker Desktop và khởi động Docker Engine. Tại thư mục project, chạy:

```bash
docker compose up --build
```

Mở [http://localhost:8080](http://localhost:8080). API có thể kiểm tra tại [http://localhost:3000/api/health](http://localhost:3000/api/health).

Để dừng các dịch vụ, nhấn `Ctrl+C`, sau đó chạy `docker compose down`. Muốn xóa cả dữ liệu database demo, chạy `docker compose down -v`.

## Kịch bản minh họa lỗi môi trường

1. Cho thành viên thử chạy API trực tiếp trên máy bằng `npm install` và `npm start` trong `backend/`.
2. Backend yêu cầu **Node.js 18.x** và PostgreSQL sẵn sàng tại `localhost:5432`. Thiếu hoặc sai phiên bản Node, chưa cài database, hoặc sai cấu hình kết nối sẽ làm bước khởi động thất bại.
3. Mỗi thành viên ghi lại lỗi và nguyên nhân dự đoán. Có thể trình bày các khác biệt về runtime, dịch vụ database, biến môi trường và thông tin kết nối.
4. Cả nhóm chuyển sang `docker compose up --build`. Compose cấp cùng phiên bản Node.js và PostgreSQL, đồng thời thiết lập kết nối dịch vụ.
5. So sánh kết quả: các máy có Docker khởi động dịch vụ theo cấu hình dự án thay vì dựa vào các phiên bản và database đã cài riêng trên máy.

Frontend cũng có thể chạy riêng bằng `npm install` và `npm start` trong `frontend/`; mặc định trang sẽ gọi API tại `http://localhost:3000`.

## Cấu hình

Các giá trị demo mặc định được khai báo trong `docker-compose.yml`. Không dùng mật khẩu demo này cho môi trường thật. Có thể ghi đè cấu hình database bằng các biến `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, và `DATABASE_URL`.

## Cấu trúc

```text
.
├── backend/       # REST API Node.js + PostgreSQL
├── frontend/      # Giao diện HTML/CSS/JS
├── docker-compose.yml
└── README.md
```
