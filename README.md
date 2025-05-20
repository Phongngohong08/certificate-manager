# Blockchain Academic Certificates

Dự án này triển khai một hệ thống quản lý chứng chỉ học thuật dựa trên blockchain sử dụng Hyperledger Fabric.

## Cấu trúc dự án

- `chaincode/`: Chứa mã nguồn smart contract
- `web-app/`: Ứng dụng web frontend
- `resources/`: Tài nguyên và tài liệu

## Yêu cầu hệ thống

- Docker và Docker Compose
- Node.js (phiên bản LTS)
- Go (phiên bản 1.20 trở lên)

## Cài đặt và chạy

1. Cài đặt các dependencies:
```bash
npm install
```

2. Khởi động mạng blockchain:
```bash
./network.sh up
```

3. Chạy ứng dụng web:
```bash
cd web-app
npm start
```

## Giấy phép

MIT License 