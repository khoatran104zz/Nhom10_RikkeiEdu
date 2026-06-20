# Backend - eManage Sales Management

Spring Boot 3.3 (Java 21) cung cấp REST API cho frontend React tại
`http://localhost:3001/api`.

## Vì sao backend này được viết lại

Project gốc chỉ có khung Spring Boot rỗng (`SalesManagementApplication.java`
không có entity/controller/service nào), trong khi frontend đã hoàn chỉnh và
gọi sẵn các API qua `frontend/src/services/api.js`. Toàn bộ backend trong
thư mục này được viết để khớp đúng contract mà frontend đang mong đợi
(đường dẫn, tên field JSON, format response phân trang, format lỗi...),
không đổi bất kỳ dòng nào ở phía frontend.

Ngoài ra, `pom.xml` gốc có một số khai báo không tồn tại trong thực tế
(`spring-boot-starter-parent` version `4.1.0`, Java `26`, artifact
`spring-boot-starter-webmvc`...) nên đã được sửa lại thành các phiên bản
thật, có thể tải về và build được (Spring Boot `3.3.5`, Java `21`,
`spring-boot-starter-web`).

## Endpoint chính

Tất cả endpoint nằm dưới prefix `/api`.

| Resource | Method & Path | Ghi chú |
|---|---|---|
| Categories | `GET/POST /categories`, `PUT/DELETE /categories/{id}` | `?search=` |
| Brands | `GET/POST /brands`, `PUT/DELETE /brands/{id}` | `?search=` |
| Products | `GET/POST /products`, `GET/PUT/DELETE /products/{id}` | `?search=&page=&limit=` → `{data, total, totalPages}` |
| Customers | `GET/POST /customers`, `PUT/DELETE /customers/{id}` | `?search=` |
| Suppliers | `GET/POST /suppliers`, `PUT/DELETE /suppliers/{id}` | `?search=` |
| Employees | `GET/POST /employees`, `PUT/DELETE /employees/{id}` | `?search=` |
| Orders | `GET/POST /orders`, `GET/PUT /orders/{id}` | `?search=&status=&page=&limit=`; `PUT` nhận `{status}` |
| Stock | `GET /stock`, `GET /stock/history?type=import|export`, `POST /stock/import`, `POST /stock/export` | |
| Dashboard | `GET /dashboard` | `{stats, monthlyRevenue, topProducts, recentOrders, lowStock}` |
| Settings | `GET/PUT /settings` | Cấu hình cửa hàng (1 dòng duy nhất) |

## Quy tắc nghiệp vụ đã áp dụng (rút gọn từ docs/srs.md)

- Tạo đơn hàng từ POS sẽ trừ tồn kho ngay và từ chối nếu không đủ hàng (AC-03).
- Đơn hàng chuyển sang `cancelled` sẽ hoàn lại tồn kho đã trừ.
- Khách hàng được cộng điểm tích lũy khi đơn hàng ở trạng thái `completed`,
  và bị trừ lại điểm nếu đơn đó sau đó bị hủy (BR-06).
- Mọi lỗi nghiệp vụ/đầu vào trả về HTTP 400 hoặc 404 kèm body
  `{ "message": "..." }`.

## Những điều đơn giản hóa so với SRS đầy đủ (591 dòng)

Tài liệu `docs/srs.md` mô tả một hệ thống doanh nghiệp đầy đủ (multi-branch,
RBAC, JWT, AR/AP, audit log không thể xóa, RabbitMQ, Redis...). Backend này
chỉ hiện thực đúng phần mà **frontend hiện có** thực sự cần để chạy được —
tương ứng một hệ thống một-chi-nhánh, không xác thực người dùng. Đây là lựa
chọn có chủ đích để khớp đúng yêu cầu "liên kết FE-BE hiện có", không phải
thiếu sót. Nếu muốn mở rộng dần lên đúng scope SRS (đăng nhập/JWT, RBAC,
đa chi nhánh, công nợ...), nên làm theo từng module một, có thiết kế ERD
riêng trước khi thêm entity mới.

## employeeId trong POS

`frontend/src/pages/POS.jsx` hiện hardcode `employeeId: 'emp2'` (chuỗi,
không phải ID số thật) khi tạo đơn hàng. Backend xử lý linh hoạt: cố gắng
parse sang số, nếu không hợp lệ thì bỏ qua (đơn hàng vẫn tạo thành công,
chỉ là không gắn nhân viên). Khi cần gắn đúng nhân viên đang đăng nhập,
nên thay giá trị hardcode đó bằng ID thật một khi có cơ chế đăng nhập.
