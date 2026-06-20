**SALES MANAGEMENT PLATFORM**

**Software Requirements Specification (SRS)**

# 1. Introduction

## 1.1 Purpose

Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS) này mô tả đầy đủ, chi tiết và nhất quán các yêu cầu chức năng (Functional Requirements - FR) và yêu cầu phi chức năng (Non-Functional Requirements - NFR) cho hệ thống “Sales Management Platform” - một nền tảng quản lý bán hàng đa chi nhánh tương tự KiotViet, Sapo, Haravan.

Tài liệu được biên soạn theo chuẩn IEEE 830 / ISO/IEC/IEEE 29148, kết hợp các phương pháp mô hình hóa UML và BPMN, nhằm cung cấp cơ sở thống nhất giữa các bên liên quan (Store Owner, đội ngũ nghiệp vụ, đội ngũ phát triển, đội ngũ kiểm thử) trước khi tiến hành thiết kế chi tiết, phát triển, kiểm thử và nghiệm thu hệ thống.

Tài liệu này là tài liệu nền (baseline) cho các tài liệu liên quan trong bộ hồ sơ phân tích thiết kế dự án, bao gồm: 02\_Modules\_and\_Features, 03\_Use\_Case\_Document, 04\_ERD\_Database\_Design, 05\_Product\_Backlog, 06\_System\_Architecture và 07\_Project\_Deliverables.

## 1.2 Scope

Sales Management Platform là một hệ thống phần mềm dạng web (web-based), hỗ trợ doanh nghiệp bán lẻ vận hành đồng thời nhiều chi nhánh (multi-branch), với các nhóm chức năng chính: Quản lý sản phẩm, Quản lý kho, Quản lý đơn hàng (mua/bán), Bán hàng tại quầy (POS), Quản lý khách hàng, Quản lý nhà cung cấp, Quản lý nhân viên, Quản lý khuyến mãi, Quản lý công nợ, Báo cáo thống kê, Quản lý đa chi nhánh, Phân quyền người dùng và Dashboard điều hành.

Bảng dưới đây tóm tắt phạm vi của phiên bản 1.0 (V1.0) của hệ thống:

| **Trong phạm vi (In Scope)** | **Ngoài phạm vi (Out of Scope) - Phiên bản 1.0** |
| --- | --- |
| Quản lý sản phẩm, danh mục, thương hiệu, biến thể sản phẩm (variants). | Tích hợp bán hàng đa kênh trên các sàn thương mại điện tử (Shopee, Lazada, TikTok Shop, website B2C). |
| Quản lý kho, tồn kho, kiểm kho, chuyển kho đa chi nhánh/đa kho. | Module Kế toán tổng hợp (General Ledger, Bảng cân đối kế toán, Báo cáo tài chính theo chuẩn kế toán). |
| Quản lý đơn hàng (mua hàng, bán hàng) và bán hàng tại quầy (POS). | Tích hợp hóa đơn điện tử (e-Invoice) với cơ quan thuế (sẽ triển khai ở giai đoạn sau). |
| Quản lý khách hàng, nhà cung cấp, công nợ phải thu/phải trả. | Ứng dụng di động (mobile app) dành riêng cho khách hàng (chỉ có web/POS responsive). |
| Quản lý khuyến mãi, chương trình tích điểm khách hàng thân thiết. | Quản lý vận chuyển/logistics với đơn vị vận chuyển thứ ba (shipping carrier integration). |
| Quản lý nhân viên, chấm công cơ bản, hoa hồng bán hàng. | Quản lý nhân sự đầy đủ (HRM): tuyển dụng, đào tạo, đánh giá hiệu suất. |
| Báo cáo thống kê, dashboard điều hành đa chi nhánh. | Phân tích dữ liệu nâng cao bằng AI/ML (dự báo nhu cầu, đề xuất giá động). |
| Phân quyền người dùng theo vai trò (RBAC), audit log. | Hỗ trợ đa ngôn ngữ ngoài tiếng Việt và tiếng Anh. |
| Quản lý đa chi nhánh, đa kho, cấu hình hệ thống. | Tích hợp thanh toán quốc tế (đa tiền tệ đầy đủ). |

## 1.3 Definitions, Acronyms, and Abbreviations

Các thuật ngữ và từ viết tắt được sử dụng xuyên suốt bộ tài liệu được định nghĩa trong bảng sau:

| **Thuật ngữ / Acronym** | **Định nghĩa (Definition)** |
| --- | --- |
| SRS | Software Requirements Specification - Tài liệu Đặc tả Yêu cầu Phần mềm. |
| FR | Functional Requirement - Yêu cầu chức năng, mô tả hệ thống phải làm gì. |
| NFR | Non-Functional Requirement - Yêu cầu phi chức năng, mô tả chất lượng vận hành của hệ thống (hiệu năng, an toàn, độ tin cậy...). |
| UC | Use Case - Trường hợp sử dụng, mô tả tương tác giữa Actor và hệ thống để đạt một mục tiêu cụ thể. |
| BPMN | Business Process Model and Notation - Chuẩn mô hình hóa quy trình nghiệp vụ. |
| UML | Unified Modeling Language - Ngôn ngữ mô hình hóa hợp nhất, dùng cho Use Case Diagram, Class Diagram, Sequence Diagram... |
| POS | Point of Sale - Điểm bán hàng / màn hình bán hàng tại quầy. |
| SKU | Stock Keeping Unit - Mã quản lý hàng hóa duy nhất cho mỗi sản phẩm/biến thể. |
| RBAC | Role-Based Access Control - Kiểm soát truy cập dựa trên vai trò. |
| JWT | JSON Web Token - Định dạng token được sử dụng để xác thực người dùng. |
| KPI | Key Performance Indicator - Chỉ số đo lường hiệu suất chính. |
| RPO | Recovery Point Objective - Mức dữ liệu tối đa có thể chấp nhận mất khi xảy ra sự cố. |
| RTO | Recovery Time Objective - Thời gian tối đa để khôi phục hệ thống sau sự cố. |
| COGS | Cost of Goods Sold - Giá vốn hàng bán. |
| 3NF | Third Normal Form - Dạng chuẩn 3 trong thiết kế cơ sở dữ liệu quan hệ. |
| ERD | Entity Relationship Diagram - Sơ đồ thực thể quan hệ. |
| AR / AP | Accounts Receivable / Accounts Payable - Công nợ phải thu / phải trả. |
| Branch | Chi nhánh - một đơn vị kinh doanh độc lập của doanh nghiệp, có thể có nhiều kho. |
| Warehouse | Kho hàng - vị trí lưu trữ hàng hóa vật lý, gắn với một chi nhánh. |
| MFA / 2FA | Multi-Factor Authentication / Two-Factor Authentication - Xác thực đa yếu tố. |

## 1.4 References

Tài liệu này được xây dựng dựa trên các tham chiếu sau:

| **No.** | **Tài liệu tham chiếu (Reference)** |
| --- | --- |
| 1 | IEEE Std 830-1998 - IEEE Recommended Practice for Software Requirements Specifications. |
| 2 | ISO/IEC/IEEE 29148:2018 - Systems and software engineering - Life cycle processes - Requirements engineering. |
| 3 | OMG Unified Modeling Language (UML), Version 2.5.1 Specification. |
| 4 | OMG Business Process Model and Notation (BPMN), Version 2.0 Specification. |
| 5 | OWASP Top 10 Application Security Risks (phiên bản mới nhất). |
| 6 | OpenAPI Specification 3.0 (Swagger) cho thiết kế API. |
| 7 | Scrum Guide (Scrum.org) - Hướng dẫn quy trình Agile Scrum. |
| 8 | Quy định pháp luật Việt Nam về hóa đơn điện tử và thuế giá trị gia tăng (VAT) hiện hành. |
| 9 | Các tài liệu nội bộ dự án: 02\_Modules\_and\_Features, 03\_Use\_Case\_Document, 04\_ERD\_Database\_Design, 05\_Product\_Backlog, 06\_System\_Architecture, 07\_Project\_Deliverables. |

# 2. Overall Description

## 2.1 Product Perspective

Sales Management Platform là một hệ thống độc lập (standalone system) được triển khai dưới mô hình SaaS (Software as a Service) hoặc on-premise theo lựa chọn của khách hàng, bao gồm các thành phần chính:

* Web Admin Portal: giao diện quản trị dành cho Store Owner, Branch Manager, Accountant để cấu hình hệ thống, quản lý dữ liệu và xem báo cáo/dashboard.
* POS Web Application: giao diện bán hàng tối ưu cho Cashier, chạy trên PC hoặc máy tính bảng, hỗ trợ chế độ offline tạm thời.
* Backend API Services: cung cấp toàn bộ logic nghiệp vụ thông qua RESTful API, được xây dựng trên nền Spring Boot.
* Cơ sở dữ liệu trung tâm (PostgreSQL) lưu trữ toàn bộ dữ liệu nghiệp vụ, được chia sẻ và đồng bộ giữa các chi nhánh.
* Các thành phần hạ tầng hỗ trợ: Redis (cache), RabbitMQ (message queue), MinIO (lưu trữ file/hình ảnh).

Hệ thống không phụ thuộc vào bất kỳ hệ thống ERP/CRM/POS bên ngoài nào để vận hành các chức năng cốt lõi trong phiên bản 1.0, nhưng được thiết kế theo kiến trúc API-first để dễ dàng tích hợp với các hệ thống bên thứ ba (kế toán, thương mại điện tử, vận chuyển) trong các giai đoạn tiếp theo.

## 2.2 Product Functions

Hệ thống cung cấp các nhóm chức năng chính sau (chi tiết từng module được mô tả đầy đủ trong tài liệu 02\_Modules\_and\_Features.docx):

* Quản lý danh mục dữ liệu: Sản phẩm, Danh mục (Category), Thương hiệu (Brand), Biến thể sản phẩm (Variants).
* Quản lý kho và tồn kho: nhập/xuất kho, kiểm kê, chuyển kho giữa các chi nhánh/kho, cảnh báo tồn kho thấp.
* Quản lý đơn hàng mua (Purchase Order) và đơn hàng bán (Sales Order), bao gồm quy trình phê duyệt và nhận hàng.
* Bán hàng tại quầy (POS): tìm sản phẩm nhanh, quét mã vạch, đa phương thức thanh toán, in/gửi hóa đơn.
* Quản lý đối tác: Khách hàng (kèm nhóm khách hàng, lịch sử mua hàng) và Nhà cung cấp.
* Quản lý khuyến mãi và chương trình khách hàng thân thiết (loyalty points).
* Quản lý nhân sự cơ bản: thông tin nhân viên, chấm công, hoa hồng bán hàng.
* Quản lý công nợ phải thu/phải trả và báo cáo công nợ theo tuổi nợ (aging).
* Báo cáo thống kê đa chiều (theo chi nhánh, sản phẩm, nhân viên, thời gian) và xuất Excel/PDF.
* Dashboard điều hành tổng hợp KPI theo thời gian thực, hỗ trợ lọc theo chi nhánh và khoảng thời gian.
* Quản lý đa chi nhánh: tạo, cấu hình chi nhánh, chia sẻ hoặc tùy biến dữ liệu theo chi nhánh, báo cáo hợp nhất.
* Phân quyền người dùng theo vai trò (RBAC) và ghi nhận audit log cho toàn bộ thao tác quan trọng.
* Thông báo (notification) trong ứng dụng, qua email/SMS cho các sự kiện quan trọng.
* Cấu hình hệ thống: thuế, tiền tệ, mẫu hóa đơn, lịch sao lưu dữ liệu.

## 2.3 User Classes and Characteristics

Hệ thống phục vụ các nhóm người dùng (User Classes) sau, tương ứng với các Actor được định nghĩa chi tiết trong mục 5:

| **User Class** | **Mô tả (Description)** | **Mức độ thành thạo CNTT** | **Tần suất sử dụng** |
| --- | --- | --- | --- |
| Store Owner | Chủ doanh nghiệp/người sở hữu hệ thống; có toàn quyền cấu hình, xem báo cáo tổng hợp toàn bộ chuỗi chi nhánh. | Trung bình | Hàng ngày / hàng tuần |
| Branch Manager | Quản lý vận hành một chi nhánh cụ thể: nhân sự, tồn kho, đơn hàng, khuyến mãi, báo cáo chi nhánh. | Trung bình | Hàng ngày |
| Cashier | Nhân viên bán hàng tại quầy, sử dụng chủ yếu màn hình POS để tạo đơn và thu tiền. | Cơ bản | Liên tục trong ca làm việc |
| Inventory Staff | Nhân viên kho, thực hiện nhập/xuất/kiểm kê/chuyển kho hàng hóa. | Cơ bản | Hàng ngày |
| Accountant | Kế toán, theo dõi công nợ, thanh toán, báo cáo doanh thu - chi phí. | Trung bình | Hàng ngày / hàng tuần |
| Customer | Khách hàng mua sắm tại cửa hàng; tương tác gián tiếp qua Cashier (tích điểm, nhận hóa đơn) hoặc trực tiếp qua cổng tra cứu điểm/công nợ (nếu được cấp). | Cơ bản | Theo lần mua hàng |

## 2.4 Operating Environment

Hệ thống được thiết kế để hoạt động trong môi trường kỹ thuật sau:

| **Thành phần (Component)** | **Đặc tả kỹ thuật (Specification)** |
| --- | --- |
| Client - Web Admin | Trình duyệt hiện đại: Google Chrome, Microsoft Edge, Mozilla Firefox, Safari (2 phiên bản gần nhất); độ phân giải tối thiểu 1366x768. |
| Client - POS Terminal | Ứng dụng web (PWA) chạy trên PC Windows 10+ hoặc máy tính bảng Android/iOS, hỗ trợ kết nối máy in nhiệt và máy quét mã vạch qua USB/Bluetooth. |
| Frontend Stack | NextJS, TypeScript, TailwindCSS. |
| Backend Stack | Spring Boot (Java), kiến trúc RESTful API. |
| Database | PostgreSQL 14 trở lên, chuẩn hóa tới 3NF. |
| Cache Layer | Redis 7.x cho cache dữ liệu truy cập nhiều và quản lý session. |
| Message Queue | RabbitMQ 3.12.x cho xử lý bất đồng bộ (notification, report generation, đồng bộ tồn kho). |
| Object Storage | MinIO (tương thích S3) lưu trữ hình ảnh sản phẩm, file đính kèm, file export báo cáo. |
| Authentication | JWT (JSON Web Token) kèm refresh token, hỗ trợ 2FA cho tài khoản quản trị. |
| Containerization | Docker / Docker Compose; có thể mở rộng sang Kubernetes ở giai đoạn sau. |
| CI/CD | GitHub Actions cho build, test, và deploy tự động. |
| Cloud Hosting | Amazon Web Services (AWS): EC2/ECS, RDS (PostgreSQL), S3/MinIO, Application Load Balancer, CloudWatch. |
| Giao tiếp mạng | HTTPS/TLS 1.2 trở lên cho toàn bộ giao tiếp client-server và service-to-service. |

# 3. Business Objectives

Các mục tiêu kinh doanh dưới đây định hướng toàn bộ quá trình phân tích, thiết kế và phát triển hệ thống. Mỗi mục tiêu được liên kết với các nhóm yêu cầu chức năng và phi chức năng tương ứng trong các mục 6 và 7.

| **ID** | **Mục tiêu (Objective)** | **Mô tả / Tiêu chí thành công (Success Metric)** |
| --- | --- | --- |
| BO-01 | Chuẩn hóa và tự động hóa quy trình bán hàng đa chi nhánh | Giảm thời gian xử lý một đơn hàng tại POS xuống dưới 2 giây; 100% chi nhánh sử dụng cùng một quy trình bán hàng thống nhất. |
| BO-02 | Kiểm soát tồn kho chính xác, giảm thất thoát hàng hóa | Sai lệch giữa tồn kho hệ thống và tồn kho thực tế (qua kiểm kê) giảm xuống dưới 1% theo giá trị. |
| BO-03 | Tăng doanh thu thông qua khuyến mãi và chương trình khách hàng thân thiết | Tăng tỷ lệ khách hàng quay lại (repeat purchase rate) tối thiểu 15% sau 6 tháng triển khai loyalty program. |
| BO-04 | Cung cấp dữ liệu báo cáo, dashboard theo thời gian thực hỗ trợ ra quyết định | Ban điều hành có thể xem báo cáo doanh thu/tồn kho hợp nhất toàn hệ thống trong vòng 3 giây, dữ liệu cập nhật trễ không quá 5 phút. |
| BO-05 | Quản lý công nợ minh bạch với khách hàng và nhà cung cấp | 100% giao dịch bán/mua có công nợ được theo dõi tự động, báo cáo aging được tạo định kỳ hàng tuần. |
| BO-06 | Hỗ trợ mở rộng quy mô kinh doanh | Hệ thống có thể mở rộng từ 1 lên tối thiểu 100 chi nhánh mà không cần thiết kế lại kiến trúc (theo NFR-038). |
| BO-07 | Bảo đảm an toàn dữ liệu và phân quyền rõ ràng | 100% người dùng được gán vai trò và quyền truy cập tương ứng; không có truy cập trái phép được ghi nhận trong audit log. |
| BO-08 | Giảm chi phí vận hành nhờ tự động hóa báo cáo và quy trình duyệt | Giảm tối thiểu 30% thời gian lập báo cáo cuối ngày/cuối kỳ so với quy trình thủ công hiện tại. |

# 4. Stakeholders

Các bên liên quan (stakeholders) của dự án bao gồm:

| **Stakeholder** | **Vai trò / Lợi ích trong dự án (Role / Interest)** |
| --- | --- |
| Store Owner (Chủ sở hữu doanh nghiệp) | Người ra quyết định cuối cùng, tài trợ dự án (Project Sponsor); quan tâm đến hiệu quả đầu tư (ROI), khả năng mở rộng và bảo mật dữ liệu kinh doanh. |
| Branch Manager | Người vận hành chính tại chi nhánh; quan tâm đến tính dễ sử dụng, độ chính xác báo cáo, hiệu quả quản lý nhân sự và tồn kho. |
| Nhân viên bán hàng (Cashier) | Người sử dụng POS hàng ngày; quan tâm đến tốc độ xử lý đơn hàng, độ ổn định của hệ thống. |
| Nhân viên kho (Inventory Staff) | Người thực hiện nhập/xuất/kiểm kho; quan tâm đến độ chính xác và tốc độ cập nhật tồn kho. |
| Kế toán (Accountant) | Người theo dõi công nợ, doanh thu, chi phí; quan tâm đến tính chính xác và khả năng xuất báo cáo tài chính cơ bản. |
| Khách hàng (Customer) | Người tiêu dùng cuối; quan tâm đến tốc độ thanh toán, chính sách tích điểm/khuyến mãi, hóa đơn rõ ràng. |
| Nhà cung cấp (Supplier) | Đối tác cung ứng hàng hóa; gián tiếp liên quan qua quy trình đặt hàng và thanh toán công nợ. |
| Đội ngũ phát triển (Development Team) | Chịu trách nhiệm thiết kế, xây dựng, kiểm thử hệ thống theo đúng đặc tả; quan tâm đến tính rõ ràng, đầy đủ của yêu cầu. |
| Đội ngũ QA/Kiểm thử | Chịu trách nhiệm đảm bảo chất lượng; cần các tiêu chí nghiệm thu (Acceptance Criteria) rõ ràng, đo lường được. |
| Quản lý dự án / Product Owner | Điều phối tiến độ, ưu tiên backlog, đảm bảo sản phẩm đáp ứng đúng mục tiêu kinh doanh. |
| Đội vận hành hạ tầng (IT Operations) | Vận hành hạ tầng cloud (AWS), CI/CD, giám sát hệ thống; quan tâm đến NFR về độ sẵn sàng, khả năng mở rộng, bảo trì. |

# 5. Actors

Các Actor sau tương tác trực tiếp hoặc gián tiếp với hệ thống. Danh sách Actor này được sử dụng nhất quán trong toàn bộ tài liệu Use Case (03\_Use\_Case\_Document.docx):

| **Actor** | **Mô tả (Description)** | **Trách nhiệm chính trong hệ thống (Key Responsibilities)** |
| --- | --- | --- |
| Store Owner | Chủ doanh nghiệp, có quyền cao nhất trong hệ thống, quản lý toàn bộ chuỗi chi nhánh. | Cấu hình hệ thống, quản lý chi nhánh, quản lý người dùng và phân quyền, xem báo cáo/dashboard hợp nhất toàn hệ thống, phê duyệt các thay đổi quan trọng (giá, khuyến mãi, hạn mức công nợ). |
| Branch Manager | Quản lý vận hành một chi nhánh cụ thể. | Quản lý nhân viên, tồn kho, đơn hàng, khuyến mãi tại chi nhánh; phê duyệt đơn đặt hàng, chuyển kho, điều chỉnh tồn kho; xem báo cáo của chi nhánh. |
| Cashier | Nhân viên thu ngân/bán hàng tại quầy. | Tạo đơn hàng tại POS, quét mã vạch, áp dụng khuyến mãi, thu tiền, in/gửi hóa đơn, tra cứu thông tin khách hàng/sản phẩm. |
| Inventory Staff | Nhân viên kho. | Thực hiện nhập kho (theo PO), xuất kho, kiểm kê (stock-take), tạo và xác nhận yêu cầu chuyển kho, cập nhật trạng thái tồn kho. |
| Accountant | Kế toán của doanh nghiệp/chi nhánh. | Theo dõi công nợ phải thu/phải trả, ghi nhận thanh toán, xuất báo cáo doanh thu - chi phí - lợi nhuận, đối soát hóa đơn. |
| Customer | Khách hàng mua sắm. | Thực hiện giao dịch mua hàng (qua Cashier), tích lũy và sử dụng điểm thưởng, theo dõi lịch sử mua hàng và công nợ cá nhân (nếu được cấp quyền truy cập). |

# 6. Functional Requirements

Mục này đặc tả toàn bộ các yêu cầu chức năng (Functional Requirements) của hệ thống, được tổ chức theo 25 module nghiệp vụ tương ứng với tài liệu 02\_Modules\_and\_Features.docx. Mỗi yêu cầu được gán một mã định danh duy nhất (FR-XXX), mô tả theo cấu trúc “System shall...” và một mức độ ưu tiên (Priority: High / Medium / Low) phục vụ việc lập kế hoạch Sprint trong 05\_Product\_Backlog.docx.

Tổng số yêu cầu chức năng được đặc tả: 114 (FR-001 đến FR-114).

### 6.1 Authentication

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-001 | System shall allow registered users to log in using a username/email and password. | High |
| FR-002 | System shall allow users to log out securely, terminating all active sessions for that device. | High |
| FR-003 | System shall enforce password complexity rules (minimum length, uppercase, number, special character) when an account is created or a password is changed. | High |
| FR-004 | System shall support password reset via email or OTP verification. | High |
| FR-005 | System shall lock a user account for a configurable duration after a configurable number of consecutive failed login attempts. | Medium |

### 6.2 User Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-006 | System shall allow Store Owner and Branch Manager to create new user accounts and assign them to branches. | High |
| FR-007 | System shall allow authorized users to edit user profile information (name, contact details, branch, status). | High |
| FR-008 | System shall allow authorized users to deactivate or reactivate a user account. | High |
| FR-009 | System shall allow each user to update their own profile information and avatar. | Medium |
| FR-010 | System shall maintain a change history (who/when/what) for all updates made to a user account. | Medium |

### 6.3 Role & Permission

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-011 | System shall allow administrators to create, edit, and delete custom roles. | High |
| FR-012 | System shall allow administrators to assign granular permissions (view, create, edit, delete, approve, export) to a role at module and feature level. | High |
| FR-013 | System shall allow administrators to assign one or more roles to a user account. | High |
| FR-014 | System shall restrict access to screens, actions, and data based on the permissions of the roles assigned to the logged-in user. | High |
| FR-015 | System shall provide a role-permission matrix screen for administrators to review and edit permission assignments. | Medium |

### 6.4 Product Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-016 | System shall allow authorized users to create a new product with SKU, name, description, unit of measure, cost price, selling price, and images. | High |
| FR-017 | System shall allow authorized users to edit existing product information. | High |
| FR-018 | System shall allow authorized users to deactivate (soft delete) a product so it no longer appears in active sales but remains in historical records. | High |
| FR-019 | System shall support product variants (e.g., size, color, material) linked to a parent product, each with its own SKU, price, and stock. | High |
| FR-020 | System shall allow authorized users to import and export product catalogs via Excel/CSV templates. | Medium |
| FR-021 | System shall allow users to search and filter products by name, SKU, barcode, category, brand, and status. | High |
| FR-022 | System shall allow users to generate, attach, and print barcodes/QR codes for products and variants. | Medium |

### 6.5 Category Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-023 | System shall allow authorized users to create, edit, and delete product categories. | High |
| FR-024 | System shall support a hierarchical (parent-child, multi-level) category structure. | Medium |
| FR-025 | System shall allow authorized users to assign one or more categories to a product. | High |
| FR-026 | System shall allow users to browse and filter products by category in catalog and reporting screens. | Medium |

### 6.6 Brand Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-027 | System shall allow authorized users to create, edit, and delete product brands. | Medium |
| FR-028 | System shall allow authorized users to assign a brand to each product. | Medium |
| FR-029 | System shall allow users to filter products, sales, and inventory reports by brand. | Low |

### 6.7 Supplier Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-030 | System shall allow authorized users to create, edit, and delete supplier records. | High |
| FR-031 | System shall store supplier contact information, tax code, bank account details, and payment terms. | Medium |
| FR-032 | System shall allow users to view the purchase order and goods receipt history associated with each supplier. | Medium |
| FR-033 | System shall allow users to associate one or more products with a supplier, including supplier-specific cost prices. | Medium |
| FR-034 | System shall track outstanding payable balances owed to each supplier based on purchase and payment transactions. | High |

### 6.8 Customer Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-035 | System shall allow authorized users to create, edit, and delete customer records. | High |
| FR-036 | System shall store customer contact information, address, date of birth, and assigned customer group/tier. | High |
| FR-037 | System shall allow users to view the complete purchase and payment history for each customer. | High |
| FR-038 | System shall allow authorized users to create and manage customer groups (e.g., Retail, Wholesale, VIP) with group-specific pricing or discount policies. | Medium |
| FR-039 | System shall allow authorized users to import and export customer lists via Excel/CSV templates. | Medium |
| FR-040 | System shall allow cashiers to search and select an existing customer by phone number or name during a sales transaction, or quickly create a new customer. | High |

### 6.9 Inventory Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-041 | System shall maintain the on-hand stock quantity of each product/variant per branch and per warehouse in real time. | High |
| FR-042 | System shall record stock-in transactions resulting from goods receipt, stock transfer-in, or positive inventory adjustment. | High |
| FR-043 | System shall record stock-out transactions resulting from sales, stock transfer-out, negative inventory adjustment, or damage/loss. | High |
| FR-044 | System shall allow authorized users to perform a stock-take (physical inventory count), compare counted quantities against system quantities, and post reconciling adjustments. | High |
| FR-045 | System shall generate low-stock alerts when on-hand quantity falls below a configurable reorder threshold per product/branch. | High |
| FR-046 | System shall allow authorized users to create and process stock transfer requests between branches or warehouses. | High |
| FR-047 | System shall maintain a complete, immutable audit trail of all inventory transactions, including transaction type, quantity, date/time, and responsible user. | High |

### 6.10 Warehouse Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-048 | System shall allow authorized users to create, edit, and delete warehouse records and associate each warehouse with a branch. | Medium |
| FR-049 | System shall allow a single branch to have one or more associated warehouses. | Medium |
| FR-050 | System shall allow users to view stock balances broken down by warehouse within a branch. | Medium |
| FR-051 | System shall support a stock transfer request and approval workflow between warehouses, with status tracking (Pending, Approved, In Transit, Received). | Medium |

### 6.11 Purchase Order

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-052 | System shall allow authorized users to create purchase orders (PO) addressed to a supplier. | High |
| FR-053 | System shall allow users to add multiple product line items to a PO, each with quantity, unit cost, and line discount. | High |
| FR-054 | System shall support a configurable PO approval workflow before the PO can be sent to the supplier. | Medium |
| FR-055 | System shall allow authorized users to record full or partial goods receipt against a PO, including discrepancy notes. | High |
| FR-056 | System shall automatically increase on-hand inventory quantities upon confirmation of a goods receipt. | High |
| FR-057 | System shall allow authorized users to edit or cancel a PO prior to any goods receipt being recorded against it. | Medium |

### 6.12 Sales Order

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-058 | System shall allow authorized users to create sales orders for a selected customer and branch. | High |
| FR-059 | System shall allow users to add multiple product line items to a sales order, each with quantity, unit price, line discount, and applicable tax. | High |
| FR-060 | System shall automatically calculate order subtotal, total discount, total tax, shipping fee, and grand total. | High |
| FR-061 | System shall track sales order status through defined states: Pending, Confirmed, Packed, Delivered, Completed, Cancelled. | High |
| FR-062 | System shall automatically deduct on-hand inventory quantities upon order confirmation or delivery, depending on configuration. | High |
| FR-063 | System shall allow authorized users to generate an invoice document from a completed or confirmed sales order. | High |

### 6.13 POS (Point of Sale)

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-064 | System shall provide a point-of-sale (POS) interface optimized for quick product search and addition to a cart. | High |
| FR-065 | System shall support barcode scanning (via camera or hardware scanner) to add items to the POS cart. | High |
| FR-066 | System shall support recording multiple payment methods (cash, card, e-wallet, bank transfer) within a single POS transaction. | High |
| FR-067 | System shall automatically calculate the change due to the customer for cash payments. | High |
| FR-068 | System shall allow cashiers to apply eligible discounts, vouchers, or promotions at the point of checkout. | High |
| FR-069 | System shall allow cashiers to print a physical receipt or send an electronic receipt (email/SMS) to the customer. | High |
| FR-070 | System shall allow cashiers to hold/park an in-progress cart for later recall and to split a single bill into multiple payments or invoices. | Medium |

### 6.14 Payment

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-071 | System shall record one or more payment transactions against a sales invoice or purchase invoice. | High |
| FR-072 | System shall support partial payments and continuously track the remaining outstanding balance of an invoice. | High |
| FR-073 | System shall allow authorized users to record refunds and link each refund to its original payment transaction. | High |
| FR-074 | System shall support integration with third-party payment gateways for card and e-wallet transaction processing. | Medium |
| FR-075 | System shall generate a payment receipt/voucher for every recorded payment or refund transaction. | Medium |

### 6.15 Promotion

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-076 | System shall allow authorized users to create promotion campaigns with defined start and end dates. | High |
| FR-077 | System shall support multiple discount types: percentage discount, fixed-amount discount, buy-X-get-Y, and bundle pricing. | High |
| FR-078 | System shall allow promotions to be scoped to specific products, categories, branches, or customer groups. | Medium |
| FR-079 | System shall automatically identify and apply eligible promotions to a cart or order at checkout. | High |
| FR-080 | System shall prevent the application of overlapping or conflicting promotions on the same line item, based on configurable combination rules. | Medium |

### 6.16 Loyalty Program

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-081 | System shall automatically accrue loyalty points to a customer's account based on the value of completed purchases. | Medium |
| FR-082 | System shall allow customers to redeem accumulated loyalty points as a discount on a future purchase. | Medium |
| FR-083 | System shall allow administrators to configure point-earning ratios and point-redemption values. | Medium |
| FR-084 | System shall display a customer's current loyalty point balance and full point transaction history. | Medium |

### 6.17 Employee Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-085 | System shall allow authorized users to create, edit, and delete employee records, including personal details and employment information. | Medium |
| FR-086 | System shall store each employee's position/title, assigned branch, contact details, and salary configuration. | Medium |
| FR-087 | System shall allow authorized users to assign employees to one or more branches and roles. | Medium |
| FR-088 | System shall track each employee's sales performance and calculate commission based on configurable commission rules. | Medium |

### 6.18 Attendance

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-089 | System shall allow employees to record check-in and check-out times for each work shift. | Medium |
| FR-090 | System shall allow managers to view, edit, and approve employee attendance records. | Medium |
| FR-091 | System shall generate attendance summary reports per employee and per branch for payroll calculation periods. | Medium |

### 6.19 Debt Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-092 | System shall track accounts receivable (amounts owed by each customer) based on unpaid or partially paid sales invoices. | High |
| FR-093 | System shall track accounts payable (amounts owed to each supplier) based on unpaid or partially paid purchase invoices. | High |
| FR-094 | System shall generate debt aging reports categorizing outstanding balances by overdue period (e.g., current, 1-30, 31-60, 60+ days). | Medium |
| FR-095 | System shall send automated reminder notifications to responsible staff for debts approaching or past their due date. | Medium |

### 6.20 Reporting

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-096 | System shall generate sales reports broken down by day, week, month, branch, employee, and product. | High |
| FR-097 | System shall generate inventory reports including stock balance, stock movement history, and stock valuation. | High |
| FR-098 | System shall generate financial reports including revenue, gross profit, and cost of goods sold (COGS). | High |
| FR-099 | System shall allow users to export any generated report to Excel and PDF formats. | Medium |
| FR-100 | System shall allow users to schedule recurring report generation and automatic delivery via email. | Low |

### 6.21 Dashboard

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-101 | System shall display an executive dashboard summarizing key performance indicators: total revenue, order count, gross profit, and top-selling products. | High |
| FR-102 | System shall allow users to filter dashboard data by date range and by branch (or across all branches). | High |
| FR-103 | System shall display real-time charts and graphs illustrating sales trends over time. | Medium |

### 6.22 Notification

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-104 | System shall send in-app notifications for significant events such as low-stock alerts, sales order status changes, and debt due dates. | Medium |
| FR-105 | System shall send email or SMS notifications for critical alerts as configured by the user or administrator. | Medium |
| FR-106 | System shall allow each user to configure which notification types and channels they wish to receive. | Low |

### 6.23 Multi-Branch Management

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-107 | System shall allow the Store Owner to create, configure, and manage multiple branches under a single organization account. | High |
| FR-108 | System shall allow master data (products, pricing, promotions) to be shared across all branches or customized per branch, based on configuration. | High |
| FR-109 | System shall provide consolidated reports and dashboards aggregating data across all branches, in addition to per-branch views. | High |

### 6.24 Audit Log

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-110 | System shall automatically log every create, update, and delete operation performed on business data, capturing the responsible user, timestamp, and before/after values. | High |
| FR-111 | System shall allow administrators to search, filter, and export audit log entries by user, date range, module, and action type. | Medium |

### 6.25 Settings

| **ID** | **Functional Requirement** | **Priority** |
| --- | --- | --- |
| FR-112 | System shall allow administrators to configure system-wide settings, including default currency, tax rates, time zone, and business operating hours. | Medium |
| FR-113 | System shall allow administrators to configure branch-specific settings, including receipt/invoice templates and connected printer/scanner devices. | Medium |
| FR-114 | System shall allow administrators to configure automated data backup schedules and retention policies. | Medium |

# 7. Non-Functional Requirements

Mục này đặc tả các yêu cầu phi chức năng (Non-Functional Requirements - NFR), mô tả các thuộc tính chất lượng mà hệ thống phải đáp ứng, được tổ chức theo 6 nhóm: Security, Performance, Reliability, Availability, Scalability và Maintainability.

Tổng số yêu cầu phi chức năng được đặc tả: 54 (NFR-001 đến NFR-054).

### 7.1 Security

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-001 | All user passwords shall be stored using a secure, industry-standard one-way hashing algorithm (e.g., bcrypt or Argon2) with per-user salt. | High |
| NFR-002 | System shall enforce HTTPS/TLS 1.2 or higher for all client-server and service-to-service communications. | High |
| NFR-003 | System shall implement role-based access control (RBAC) consistently across all modules and API endpoints. | High |
| NFR-004 | System shall use signed JWT access tokens with a configurable expiration time and refresh-token rotation for session management. | High |
| NFR-005 | System shall log all authentication attempts, both successful and failed, including IP address and timestamp. | Medium |
| NFR-006 | System shall mask or redact sensitive data (e.g., card numbers, national ID numbers) in application logs and on-screen displays where full visibility is not required. | High |
| NFR-007 | System shall handle customer personal data in accordance with applicable data protection regulations, including data access and deletion requests. | High |
| NFR-008 | System shall automatically terminate a user session after a configurable period of inactivity (default 30 minutes). | Medium |
| NFR-009 | System shall validate and sanitize all user-supplied input on both client and server sides to prevent SQL injection, XSS, and command injection attacks. | High |
| NFR-010 | System shall support optional two-factor authentication (2FA) for privileged accounts, including Store Owner and Branch Manager roles. | Medium |

### 7.2 Performance

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-011 | System shall respond to at least 95% of standard read API requests within 500 milliseconds under normal operating load. | High |
| NFR-012 | A POS checkout transaction, from final item scan to payment confirmation, shall complete within 2 seconds under normal load. | High |
| NFR-013 | System shall support at least 200 concurrent active users per branch without measurable degradation in response time. | High |
| NFR-014 | System shall maintain product search response times under 1 second for catalogs containing up to 100,000 SKUs. | Medium |
| NFR-015 | Dashboard widgets and standard reports shall render within 3 seconds for date ranges of up to one year. | Medium |
| NFR-016 | System shall employ an in-memory cache (Redis) for frequently accessed read-heavy data such as product catalog, pricing, and promotion rules. | Medium |
| NFR-017 | All list views returning more than 50 records shall be paginated, with configurable page sizes. | Medium |
| NFR-018 | A barcode scan event shall result in the corresponding item being added to the POS cart within 300 milliseconds. | High |
| NFR-019 | Bulk import of up to 10,000 product records shall complete within 5 minutes, processed asynchronously with progress feedback to the user. | Low |

### 7.3 Reliability

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-020 | All financial operations (orders, payments, inventory adjustments) shall be executed within database transactions to guarantee atomicity and consistency. | High |
| NFR-021 | System shall automatically retry failed asynchronous background jobs (e.g., notification delivery, report generation) up to 3 times with exponential backoff. | Medium |
| NFR-022 | System shall perform automated full database backups at least once per day, with incremental backups at least every 6 hours. | High |
| NFR-023 | System shall support point-in-time recovery with a recovery point objective (RPO) of no more than 15 minutes of data loss. | High |
| NFR-024 | System shall run scheduled reconciliation jobs to detect and flag inconsistencies between recorded inventory transactions and computed stock balances. | Medium |
| NFR-025 | The POS module shall queue sales transactions locally during network interruptions and synchronize them with the server automatically once connectivity is restored, without data loss or duplication. | High |
| NFR-026 | System shall detect and alert administrators of critical application errors within 5 minutes of occurrence via the monitoring/alerting pipeline. | Medium |
| NFR-027 | System shall enforce referential integrity constraints at the database level for all related entities (e.g., orders, order lines, products, customers). | High |
| NFR-028 | System shall support transactional rollback for any failed batch operation, ensuring no partial updates are persisted. | Medium |

### 7.4 Availability

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-029 | System shall maintain at least 99.5% uptime, measured monthly, excluding pre-announced scheduled maintenance windows. | High |
| NFR-030 | Scheduled maintenance shall be communicated to users at least 24 hours in advance through in-app notifications. | Low |
| NFR-031 | The POS module shall support an offline mode allowing sales transactions to continue during internet outages, with automatic data synchronization upon reconnection. | High |
| NFR-032 | Production infrastructure shall be deployed across multiple availability zones to eliminate single points of failure in compute and database layers. | Medium |
| NFR-033 | System shall provide automatic failover for the primary database to a standby replica with minimal manual intervention. | Medium |
| NFR-034 | Following a service outage, system shall be restored to normal operation within a recovery time objective (RTO) of 30 minutes. | High |
| NFR-035 | System health (API availability, queue depth, database connectivity) shall be continuously monitored with automated alerting on threshold breaches. | Medium |
| NFR-036 | Critical operations submitted during a downtime period shall be queued and automatically processed once the system is restored. | Medium |

### 7.5 Scalability

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-037 | Application servers shall be horizontally scalable, allowing additional instances to be added without service interruption. | High |
| NFR-038 | System architecture shall support growth from 1 branch to at least 100 branches per organization without requiring fundamental redesign. | High |
| NFR-039 | Database architecture shall support read replicas dedicated to reporting and analytics workloads, separate from transactional workloads. | Medium |
| NFR-040 | System shall use a message queue (RabbitMQ) to decouple and asynchronously process high-volume tasks such as notifications, exports, and report generation. | Medium |
| NFR-041 | System shall support load balancing of incoming requests across multiple application server instances. | Medium |
| NFR-042 | System data model shall support logical partitioning of data per organization (tenant) to enable future multi-tenant deployment. | Low |
| NFR-043 | File and image storage (product images, attachments) shall scale independently of application servers using object storage (MinIO/S3-compatible). | Medium |
| NFR-044 | All application components shall be containerized (Docker) to enable elastic scaling and consistent deployment across environments. | High |
| NFR-045 | System shall handle peak traffic of up to 5 times normal load (e.g., during promotional campaigns) without manual scaling intervention, given configured auto-scaling policies. | Medium |

### 7.6 Maintainability

| **ID** | **Non-Functional Requirement** | **Priority** |
| --- | --- | --- |
| NFR-046 | System shall follow a modular, layered architecture with clear separation between presentation, business logic, and data access layers. | High |
| NFR-047 | System shall expose RESTful APIs with explicit versioning to preserve backward compatibility for existing client integrations. | Medium |
| NFR-048 | Automated unit and integration tests shall cover at least 70% of core business logic, executed as part of the build pipeline. | Medium |
| NFR-049 | API documentation shall be automatically generated and kept up to date using an OpenAPI/Swagger specification. | Medium |
| NFR-050 | System shall implement centralized, structured logging across all services to facilitate debugging, tracing, and monitoring. | Medium |
| NFR-051 | System shall be supported by CI/CD pipelines that automate build, test, and deployment steps for every code change. | High |
| NFR-052 | System configuration values (database connections, API keys, feature flags) shall be externalized via environment variables or configuration files rather than hardcoded. | High |
| NFR-053 | Source code shall adhere to documented coding standards and pass automated static analysis/linting checks prior to merge. | Medium |
| NFR-054 | System shall support feature toggles, allowing new or experimental functionality to be enabled or disabled without a full redeployment. | Low |

# 8. Business Rules

Các quy tắc nghiệp vụ (Business Rules) dưới đây ràng buộc cách thức hệ thống xử lý dữ liệu và quy trình, độc lập với giao diện người dùng. Các quy tắc này phải được thực thi tại tầng business logic (backend) và, khi phù hợp, được phản ánh ở tầng cơ sở dữ liệu (constraints, triggers).

| **ID** | **Quy tắc nghiệp vụ (Business Rule)** |
| --- | --- |
| BR-01 | Mỗi sản phẩm phải thuộc về tối thiểu một danh mục (category) và có duy nhất một SKU chính. |
| BR-02 | Giá bán (selling price) của sản phẩm không được thấp hơn giá vốn (cost price) trừ khi được Branch Manager hoặc Store Owner phê duyệt ngoại lệ. |
| BR-03 | Một đơn hàng bán (Sales Order) chỉ chuyển sang trạng thái Confirmed khi tồn kho khả dụng đủ để đáp ứng số lượng đặt, trừ khi cấu hình hệ thống cho phép bán âm kho (negative stock). |
| BR-04 | Mọi giao dịch thanh toán (Payment) phải được liên kết với một hóa đơn (Invoice) hợp lệ và không vượt quá số tiền còn phải thu/phải trả của hóa đơn đó. |
| BR-05 | Một chương trình khuyến mãi chỉ được áp dụng khi thời điểm hiện tại nằm trong khoảng [start\_date, end\_date] của campaign và đơn hàng thỏa điều kiện áp dụng (sản phẩm/chi nhánh/nhóm khách hàng). |
| BR-06 | Điểm thưởng (loyalty points) chỉ được cộng vào tài khoản khách hàng sau khi đơn hàng chuyển sang trạng thái Completed; nếu đơn hàng bị hủy sau đó, điểm đã cộng phải được hoàn trừ. |
| BR-07 | Người dùng có vai trò Cashier hoặc Inventory Staff chỉ được truy cập dữ liệu của chi nhánh mà họ được gán; không được xem dữ liệu của chi nhánh khác. |
| BR-08 | Mọi thao tác điều chỉnh tồn kho thủ công (inventory adjustment) phải có mã lý do (reason code) và phải được một người có quyền phê duyệt (Branch Manager) xác nhận. |
| BR-09 | Khi công nợ phải thu (AR) của một khách hàng vượt quá hạn mức tín dụng (credit limit) được cấu hình, hệ thống chặn việc tạo đơn hàng bán mới cho khách hàng đó cho đến khi Branch Manager phê duyệt ngoại lệ. |
| BR-10 | Sản phẩm đã bị deactivate (soft delete) không thể được thêm vào đơn hàng mới (PO hoặc Sales Order) nhưng vẫn hiển thị đầy đủ trong các báo cáo và đơn hàng lịch sử. |
| BR-11 | Yêu cầu chuyển kho (stock transfer) giữa hai chi nhánh/kho chỉ cập nhật tăng tồn kho tại đơn vị nhận sau khi đơn vị nhận xác nhận đã nhận hàng (received); tồn kho tại đơn vị gửi giảm ngay khi hàng được xuất. |
| BR-12 | Hóa đơn (Invoice) đã ghi nhận ít nhất một giao dịch thanh toán không được phép chỉnh sửa số lượng hoặc đơn giá của các dòng hàng; mọi điều chỉnh phải thực hiện qua chứng từ điều chỉnh (credit note) hoặc quy trình hủy có kiểm soát. |
| BR-13 | Mỗi vai trò (Role) được tạo trong hệ thống tối thiểu phải có quyền 'View' trên module Dashboard để đảm bảo người dùng luôn có điểm truy cập trung tâm. |
| BR-14 | Tỷ lệ tích điểm (point-earning rate) và tỷ lệ quy đổi điểm (point-redemption rate) chỉ có thể được thay đổi bởi Store Owner và chỉ áp dụng cho các giao dịch phát sinh sau thời điểm thay đổi có hiệu lực. |
| BR-15 | Audit Log không được phép xóa hoặc chỉnh sửa bởi bất kỳ vai trò nào trong hệ thống, bao gồm cả Store Owner, nhằm bảo đảm tính toàn vẹn của dữ liệu kiểm toán. |
| BR-16 | Một đơn đặt hàng nhà cung cấp (Purchase Order) đã có giao dịch nhận hàng (goods receipt) không thể bị xóa, chỉ có thể bị hủy phần còn lại chưa nhận. |
| BR-17 | Khi một chi nhánh mới được tạo, hệ thống tự động tạo một kho (warehouse) mặc định gắn với chi nhánh đó. |

# 9. Assumptions

Các giả định sau được áp dụng trong quá trình phân tích và thiết kế hệ thống. Nếu một giả định không còn đúng trong thực tế triển khai, phạm vi và/hoặc thiết kế tương ứng cần được xem xét lại:

* Người dùng có kết nối Internet ổn định trong phần lớn thời gian vận hành; chế độ offline tại POS chỉ áp dụng cho giao dịch bán hàng cơ bản, không áp dụng cho các chức năng quản trị.
* Mỗi chi nhánh có tối thiểu một thiết bị (PC hoặc máy tính bảng) có khả năng kết nối máy in hóa đơn nhiệt và máy quét mã vạch.
* Dữ liệu sản phẩm, khách hàng, nhà cung cấp ban đầu (nếu có từ hệ thống cũ) sẽ được chuẩn hóa và nhập vào hệ thống thông qua công cụ import Excel/CSV được cung cấp.
* Người dùng cuối (Cashier, Inventory Staff) đã được đào tạo cơ bản về quy trình bán hàng/quản lý kho và có khả năng sử dụng các thiết bị POS cơ bản.
* Hệ thống được triển khai và vận hành trên hạ tầng cloud AWS do đội ngũ vận hành (IT Operations) của dự án hoặc khách hàng quản lý.
* Tỷ giá quy đổi ngoại tệ (nếu có) được cập nhật thủ công bởi quản trị viên trong phiên bản 1.0; tích hợp tỷ giá tự động từ nguồn bên ngoài không thuộc phạm vi V1.0.
* Mỗi nhân viên (Employee) tương ứng với một tài khoản người dùng (User) duy nhất trong hệ thống; không hỗ trợ chia sẻ tài khoản giữa nhiều nhân viên.
* Múi giờ vận hành mặc định của hệ thống là GMT+7 (giờ Việt Nam), có thể cấu hình theo chi nhánh nếu doanh nghiệp mở rộng ra nước ngoài.

# 10. Constraints

Các ràng buộc sau áp đặt giới hạn lên thiết kế và triển khai của hệ thống:

* Hệ thống phải được xây dựng trên bộ công nghệ đã được phê duyệt: Frontend - NextJS, TypeScript, TailwindCSS; Backend - Spring Boot; Database - PostgreSQL; Cache - Redis; Message Queue - RabbitMQ; Storage - MinIO; Authentication - JWT; Containerization - Docker; CI/CD - GitHub Actions; Cloud - AWS (chi tiết tại 06\_System\_Architecture.docx).
* Toàn bộ giao diện người dùng và dữ liệu phải hỗ trợ tiếng Việt có dấu (Unicode UTF-8) và tiếng Anh.
* Các quy định pháp luật Việt Nam về thuế giá trị gia tăng (VAT) và hóa đơn phải được phản ánh trong cấu trúc dữ liệu hóa đơn (Invoice), mặc dù việc tích hợp hóa đơn điện tử với cơ quan thuế không thuộc phạm vi V1.0.
* Tiến độ triển khai phải tuân theo kế hoạch Sprint được xác định trong 05\_Product\_Backlog.docx và Roadmap trong 07\_Project\_Deliverables.docx.
* Phiên bản 1.0 không bao gồm tích hợp các sàn thương mại điện tử (Shopee, Lazada, TikTok Shop, website B2C); kiến trúc phải để mở khả năng tích hợp ở giai đoạn sau (xem 06\_System\_Architecture.docx - Architecture Decision Record).
* Phiên bản 1.0 không bao gồm module Kế toán tổng hợp (General Ledger) đầy đủ; chỉ giới hạn ở công nợ, doanh thu, chi phí và lợi nhuận gộp cơ bản.
* Tất cả các giao dịch tài chính (đơn hàng, thanh toán, điều chỉnh tồn kho) phải được thực hiện trong transaction của cơ sở dữ liệu để đảm bảo tính nhất quán (xem NFR-020).

# 11. Acceptance Criteria

Các tiêu chí nghiệm thu (Acceptance Criteria) ở cấp hệ thống dưới đây mô tả các kịch bản kiểm tra đầu cuối (end-to-end) tiêu biểu, được sử dụng làm cơ sở để đội QA xây dựng test case chi tiết và để Product Owner xác nhận hệ thống đáp ứng yêu cầu trước khi go-live. Các tiêu chí nghiệm thu chi tiết theo từng User Story được trình bày trong 05\_Product\_Backlog.docx.

| **ID** | **Tiêu chí nghiệm thu (Acceptance Criteria)** | **Yêu cầu liên quan** |
| --- | --- | --- |
| AC-01 | Người dùng có thể đăng nhập thành công với tài khoản hợp lệ; tài khoản sai thông tin hoặc bị khóa sẽ bị từ chối kèm thông báo rõ ràng. | FR-001 to FR-005 |
| AC-02 | Sản phẩm mới được tạo với đầy đủ thông tin bắt buộc sẽ xuất hiện trong danh mục sản phẩm và có thể được thêm vào giỏ hàng tại POS. | FR-016, FR-064 |
| AC-03 | Sau khi một đơn hàng POS được hoàn tất (Completed), tồn kho của sản phẩm liên quan giảm đúng theo số lượng đã bán tại đúng chi nhánh/kho. | FR-041, FR-062 |
| AC-04 | Khi tồn kho của một sản phẩm giảm xuống dưới ngưỡng cấu hình, hệ thống hiển thị cảnh báo low-stock trên Dashboard và gửi thông báo trong vòng 5 phút. | FR-045, FR-104 |
| AC-05 | Khuyến mãi còn hiệu lực và thỏa điều kiện sẽ được tự động áp dụng vào giỏ hàng tại POS; khuyến mãi đã hết hạn hoặc không thỏa điều kiện sẽ không được áp dụng. | FR-079, BR-05 |
| AC-06 | Công nợ khách hàng được cập nhật chính xác (tăng khi phát sinh đơn hàng chưa thanh toán, giảm khi có thanh toán); báo cáo aging phản ánh đúng số ngày quá hạn tại thời điểm xem. | FR-092, FR-094 |
| AC-07 | Báo cáo doanh thu theo chi nhánh trong một khoảng thời gian khớp với tổng giá trị các đơn hàng ở trạng thái Completed trong khoảng thời gian đó (sai lệch 0%). | FR-096, FR-109 |
| AC-08 | Người dùng không có quyền truy cập một module sẽ không thấy menu/chức năng tương ứng trên giao diện, và lời gọi API trực tiếp đến module đó trả về lỗi 403 Forbidden. | FR-014, NFR-003 |
| AC-09 | Mọi thay đổi đối với dữ liệu sản phẩm, giá, tồn kho, đơn hàng đều được ghi nhận trong Audit Log với đầy đủ người thực hiện, thời gian, giá trị trước/sau và không thể bị xóa. | FR-110, FR-111, BR-15 |
| AC-10 | Khi mất kết nối Internet tại POS, giao dịch bán hàng vẫn được lưu cục bộ; khi kết nối được khôi phục, giao dịch được đồng bộ tự động lên server đúng một lần (không trùng lặp, không mất dữ liệu). | NFR-025, NFR-031 |
| AC-11 | Trong kiểm thử tải với 200 người dùng đồng thời trên một chi nhánh, 95% request đọc dữ liệu phản hồi trong 500ms và giao dịch POS hoàn tất trong 2 giây. | NFR-011, NFR-012, NFR-013 |
| AC-12 | Bản sao lưu cơ sở dữ liệu hàng ngày có thể được khôi phục thành công trong môi trường kiểm thử, với dữ liệu khôi phục đầy đủ và nhất quán. | NFR-022, NFR-023 |
| AC-13 | Một yêu cầu chuyển kho giữa hai chi nhánh chỉ làm tăng tồn kho của chi nhánh nhận sau khi chi nhánh nhận xác nhận 'đã nhận hàng'; trước đó tồn kho hiển thị ở trạng thái 'đang chuyển'. | FR-046, FR-051, BR-11 |
| AC-14 | Điểm thưởng của khách hàng tăng đúng theo tỷ lệ cấu hình sau khi đơn hàng hoàn tất, và giảm đúng số điểm đã sử dụng khi khách hàng đổi điểm lấy ưu đãi. | FR-081, FR-082, FR-083, BR-06 |
| AC-15 | Dashboard điều hành hiển thị đúng tổng doanh thu, số đơn hàng, lợi nhuận gộp và top sản phẩm bán chạy theo bộ lọc thời gian/chi nhánh được chọn, cập nhật trong vòng 3 giây. | FR-101, FR-102, FR-103, NFR-015 |