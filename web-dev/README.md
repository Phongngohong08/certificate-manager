# Blockchain Academic Certificates Web Development

This repository contains the web development components for the Blockchain Academic Certificates platform.

- `server/`: Backend Node.js/Express API
- `client/`: Frontend ReactJS application

## Setup Instructions

1. Server setup:
   ```
   cd server/
   npm install
   npm start
   ```

2. Client setup:
   ```
   cd client/
   npm install
   npm start
   ```

## API Documentation

The backend API includes comprehensive Swagger documentation:

- **URL**: [http://localhost:3002/api-docs](http://localhost:3002/api-docs) (when server is running)
- **Features**: Interactive documentation for all API endpoints, including request/response schemas and authorization

### Documentation Resources

The following resources are available in the `server/swagger/` directory:

- [API Documentation README](server/swagger/README.md): Overview of the Swagger documentation
- [Security Guide](server/swagger/SECURITY.md): Details about API authentication and security
- [Developer Guide](server/swagger/DEVELOPER_GUIDE.md): Instructions for adding new endpoints with Swagger documentation

## Key Features

- JWT-based authentication for universities and students
- Blockchain integration for certificate issuance and verification
- Merkle tree proof generation for selective disclosure of certificate data

## Enroll Admin (Fabric CA Wallet)

Trước khi chạy backend, bạn cần enroll admin để tạo danh tính vào wallet cho Hyperledger Fabric:

1. Đảm bảo đã cấu hình đúng biến môi trường `CCP_PATH` trong file `.env`.
2. Chạy lệnh sau trong thư mục `server`:
   ```powershell
   node enrollAdmin.js
   ```
   Nếu thành công sẽ xuất hiện thông báo: `Enroll admin thành công và đã lưu vào wallet!`

Nếu không thực hiện bước này, backend sẽ báo lỗi: `Identity for user admin@hust.edu.vn not found in wallet` khi truy cập blockchain.
