# 🛒 eManage - Hệ thống Quản lý Bán hàng

Hệ thống quản lý bán hàng (MVP) tương tự KiotViet/Sapo.

- **Backend:** Java 21, Spring Boot 3.3, Spring Data JPA, H2 (in-memory, sẵn sàng đổi sang MySQL)
- **Frontend:** React 18 + Vite, TailwindCSS, Recharts, Axios

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

### Yêu cầu
- **Java 21** (JDK) — kiểm tra bằng `java -version`
- **Node.js 18+** và **npm 9+**
- Kết nối Internet ở lần chạy backend đầu tiên (Maven cần tải các thư viện Spring Boot về máy)

> Không cần cài Maven thủ công — project đã có sẵn Maven Wrapper (`mvnw` / `mvnw.cmd`), tự tải đúng phiên bản Maven khi chạy lần đầu.

### Bước 1: Cài đặt frontend
```bash
cd frontend
npm install
```

### Bước 2: Chạy backend (Terminal 1)
```bash
cd backend
./mvnw spring-boot:run
# Windows:  mvnw.cmd spring-boot:run

# Server chạy tại: http://localhost:3001
```
Lần chạy đầu tiên sẽ hơi lâu vì Maven tải dependencies. Khi thấy log
`Started SalesManagementApplication` nghĩa là backend đã sẵn sàng.

### Bước 3: Chạy frontend (Terminal 2)
```bash
cd frontend
npm run dev
# App chạy tại: http://localhost:3000
```

### Hoặc chạy đồng thời từ thư mục gốc:
```bash
npm install        # cài concurrently (chỉ cần 1 lần)
npm run dev         # chạy cả backend + frontend
```

## 🌐 Truy cập

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **H2 Console (xem dữ liệu trực tiếp, chỉ để debug):** http://localhost:3001/h2-console
  - JDBC URL: `jdbc:h2:mem:salesdb`, user: `sa`, không có mật khẩu

Vite dev server tự động forward mọi request `/api/**` sang `http://localhost:3001` (xem `frontend/vite.config.js`), nên frontend gọi API qua đường dẫn tương đối `/api/...` mà không cần cấu hình CORS thủ công.

## 📁 Cấu trúc dự án

```
sales-platform/
├── backend/                      # Spring Boot (Java 21, Maven)
│   ├── src/main/java/com/company/sales_management/
│   │   ├── config/                # CORS, DataSeeder (dữ liệu mẫu)
│   │   ├── controller/            # REST controllers (/api/...)
│   │   ├── service/                # Business logic
│   │   ├── repository/            # Spring Data JPA repositories
│   │   ├── entity/                  # JPA entities (bảng DB)
│   │   ├── dto/                       # Request/response objects
│   │   └── exception/             # Xử lý lỗi tập trung
│   ├── src/main/resources/
│   │   └── application.properties # Cấu hình DB, port, ...
│   ├── pom.xml
│   ├── mvnw / mvnw.cmd             # Maven wrapper
│   └── README-BACKEND.md           # Chi tiết kỹ thuật backend
│
└── frontend/                      # React 18 + Vite
    ├── src/
    │   ├── components/shared/      # Modal, Table, Toast, ...
    │   ├── context/ThemeContext.jsx
    │   ├── layouts/MainLayout.jsx
    │   ├── pages/                  # Dashboard, Products, POS, ...
    │   ├── services/api.js         # Axios service layer
    │   ├── utils/format.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 📊 Dữ liệu mẫu

Backend tự sinh một bộ dữ liệu mẫu nhỏ khi khởi động lần đầu (xem
`backend/.../config/DataSeeder.java`): vài danh mục, thương hiệu, sản phẩm,
khách hàng, nhà cung cấp, nhân viên và một đơn hàng mẫu — đủ để thấy giao
diện có dữ liệu ngay khi mở app, không cần nhập tay từ đầu.

## 💡 Lưu ý quan trọng

- **Database mặc định là H2 in-memory**: chạy ngay không cần cài đặt gì, nhưng
  **dữ liệu sẽ mất khi tắt backend**. Đây là lựa chọn để bạn chạy thử nhanh.
- **Để lưu dữ liệu bền vững với MySQL thật**, mở
  `backend/src/main/resources/application.properties`, comment 4 dòng cấu
  hình H2 lại và bỏ comment 4 dòng cấu hình MySQL phía trên (đã có sẵn,
  chỉ cần điền user/password của bạn). Driver MySQL đã được khai báo sẵn
  trong `pom.xml`.
- Backend chạy port **3001**, Frontend chạy port **3000** — khớp với cấu
  hình proxy trong `vite.config.js`.
- Mọi response lỗi từ backend đều có dạng `{ "message": "..." }` để khớp
  với cách `frontend/src/services/api.js` đọc và hiển thị lỗi (toast).
