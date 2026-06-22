# 🛒 eManage - Hệ thống Quản lý Bán hàng

Hệ thống quản lý bán hàng (MVP) tương tự KiotViet/Sapo.

- **Backend:** Java 21 (LTS), Spring Boot 4.1.0, Spring Data JPA, PostgreSQL
- **Frontend:** Next.js (App Router, React 19), TailwindCSS v4, Shadcn UI, Recharts, Axios, Zustand, Zod

## ✅ Tính năng

| Module | Mô tả |
|--------|-------|
| 📊 Dashboard | Tổng quan doanh thu, đơn hàng, biểu đồ |
| 📦 Sản phẩm | CRUD sản phẩm, danh mục, thương hiệu |
| 🏪 Kho hàng | Tồn kho, nhập kho, xuất kho |
| 👥 Khách hàng | CRUD, điểm tích lũy |
| 🏢 Nhà cung cấp | CRUD nhà cung cấp |
| 🛍️ Đơn bán hàng | Tạo đơn, xem chi tiết, cập nhật trạng thái |
| 💻 POS | Màn hình bán hàng, in hóa đơn |
| 👨‍💼 Nhân viên | Quản lý nhân sự |
| 📈 Báo cáo | Biểu đồ doanh thu, sản phẩm bán chạy |
| ⚙️ Cài đặt | Thông tin cửa hàng, dark mode |

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- **Java 21** (JDK, LTS) — kiểm tra bằng `java -version`
- **Node.js 18+** và **npm 9+**
- **PostgreSQL** đang chạy và đã tạo sẵn cơ sở dữ liệu tên là `sales_management`.

> Không cần cài Maven thủ công — project đã có sẵn Maven Wrapper (`mvnw` / `mvnw.cmd`), tự tải đúng phiên bản Maven khi chạy lần đầu.

### Hướng dẫn chạy nhanh (Khuyên dùng)

1. **Cài đặt dependencies cho frontend:**
   ```bash
   cd code/next-frontend
   npm install
   ```

2. **Chạy đồng thời cả Backend và Frontend từ thư mục gốc:**
   ```bash
   npm run dev
   ```
   Script này sẽ sử dụng `dev-runner.js` để tự động chạy cả Spring Boot backend (`code/backend`) và Next.js frontend (`code/next-frontend`).

---

### Hướng dẫn chạy thủ công (Từng phần)

#### Bước 1: Cấu hình và chạy Backend
1. Đảm bảo PostgreSQL của bạn đang hoạt động và có cơ sở dữ liệu `sales_management`.
2. Kiểm tra thông tin kết nối trong file [application.properties](file:///c:/Users/rosek/Downloads/eManage_G10/code/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/sales_management
   spring.datasource.username=postgres
   spring.datasource.password=123456
   ```
   *(Thay đổi username/password tương ứng với PostgreSQL của bạn nếu khác).*
3. Chạy backend bằng lệnh:
   ```bash
   cd code/backend
   
   # Trên Linux/macOS:
   ./mvnw spring-boot:run
   
   # Trên Windows:
   .\mvnw.cmd spring-boot:run
   ```
   Server backend sẽ chạy tại: **http://localhost:3001**

#### Bước 2: Chạy Frontend
1. Di chuyển vào thư mục frontend và cài đặt thư viện (chỉ cần chạy lần đầu):
   ```bash
   cd code/next-frontend
   npm install
   ```
2. Chạy ứng dụng Next.js ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   Ứng dụng frontend sẽ chạy tại: **http://localhost:3000**

## 🌐 Đường dẫn truy cập

- **Frontend App:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## 📁 Cấu trúc dự án

```
eManage_G10/
├── code/
│   ├── backend/                      # Spring Boot (Java 21, Maven)
│   │   ├── src/main/java/com/company/sales_management/
│   │   │   ├── config/                # CORS, DataSeeder (dữ liệu mẫu)
│   │   │   ├── controller/            # REST controllers (/api/...)
│   │   │   ├── service/                # Business logic
│   │   │   ├── repository/            # Spring Data JPA repositories
│   │   │   ├── entity/                  # JPA entities (bảng DB)
│   │   │   ├── dto/                       # Request/response objects
│   │   │   └── exception/             # Xử lý lỗi tập trung
│   │   ├── src/main/resources/
│   │   │   └── application.properties # Cấu hình DB, port, ...
│   │   ├── pom.xml
│   │   └── mvnw / mvnw.cmd             # Maven wrapper
│   │
│   └── next-frontend/                # React 19 + Next.js (App Router)
│       ├── src/
│       │   ├── app/                  # Next.js App Router (pages & layouts)
│       │   ├── components/           # Components UI (base/ & features/)
│       │   ├── lib/                  # Cấu hình thư viện (axios, utils)
│       │   ├── services/             # API services
│       │   ├── store/                # Zustand stores
│       │   ├── types/                # TypeScript interfaces
│       │   └── schemas/              # Zod validation schemas
│       ├── package.json
│       ├── next.config.ts
│       └── tailwind.config.ts
├── docs/                             # Tài liệu dự án (convention, srs...)
├── dev-runner.js                     # Script chạy đồng thời cả FE & BE
└── package.json                      # Scripts chạy chính của dự án
```

## 📊 Dữ liệu mẫu

Hệ thống có cấu hình tự động khởi tạo dữ liệu mẫu khi backend bắt đầu chạy lần đầu, bao gồm danh mục, sản phẩm, khách hàng, nhà cung cấp và hóa đơn mẫu, giúp giao diện hiển thị trực quan ngay lập tức mà không cần nhập thủ công.

## 💡 Lưu ý quan trọng

- **Database PostgreSQL**: Đảm bảo cổng mặc định `5432` không bị trùng và database đã được tạo trước khi khởi chạy ứng dụng.
- **Port config**: Backend chạy ở port `3001` và Frontend chạy ở port `3000`. Cấu hình này được map thông qua biến môi trường `NEXT_PUBLIC_API_URL` ở frontend.
