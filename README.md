# Blockchain Academic Certificates

A decentralized application for managing academic certificates using Hyperledger Fabric blockchain technology, with a modern Node.js backend and React.js frontend.

## Features

- Secure certificate issuance and verification using blockchain
- JWT-based authentication system
- Role-based access control (Admin, Issuer, User)
- Modern React.js frontend with Bootstrap UI
- RESTful API backend with Node.js and Express
- MongoDB database integration
- Hyperledger Fabric blockchain integration

## Prerequisites

- Node.js >= 20.x.x
- npm >= 10.x.x
- MongoDB
- Hyperledger Fabric network setup
- Docker and Docker Compose (for local development)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blockchain-academic-certificates.git
cd blockchain-academic-certificates
```

2. Install backend dependencies:
```bash
cd web-app
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the `web-app` directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/academic-certificates
JWT_SECRET=your-secret-key
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
CHANNEL_NAME=mychannel
CHAINCODE_NAME=academic-certificates
MSP_ID=Org1MSP
CONNECTION_PROFILE=./connection-profile.json
```

## Running the Application

1. Start the development servers (both backend and frontend):
```bash
cd web-app
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend development server on http://localhost:3001

2. For production:
```bash
# Build the frontend
npm run build

# Start the production server
npm run start-production
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile (protected)

### Certificates
- GET `/api/certificates` - List certificates (protected)
- POST `/api/certificates` - Issue new certificate (protected, issuer only)
- GET `/api/certificates/:id` - Get certificate details
- POST `/api/certificates/verify` - Verify certificate

## Project Structure

```
blockchain-academic-certificates/
├── web-app/                 # Backend application
│   ├── client/             # React frontend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
└── chaincode/             # Hyperledger Fabric chaincode
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. The token should be included in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Yêu cầu hệ thống

- Node.js phiên bản 20.x trở lên
- MongoDB phiên bản 6.0 trở lên
- Docker và Docker Compose
- Hyperledger Fabric 2.2.19
- Go phiên bản 1.20 trở lên

## Cài đặt các công cụ cần thiết

### 1. Cài đặt Node.js và npm
```bash
# Ubuntu/Debian:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
node -v
nvm current
npm -v
```

### 2. Cài đặt MongoDB
```bash
# Ubuntu/Debian:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Có thể tạo database ở bước này
mongosh
use blockchaincertificate (show dbs nếu không thấy phải tạo tay 1 bản ghi)
```

### 3. Cài đặt Docker và Docker Compose
```bash
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## Cài đặt và chạy dự án
### Nên chạy test fabric-samples trước
`https://github.com/Phongngohong08/hyperledger-fabric/blob/main/README_Fabric_Samples.md`

### 1. Clone repository
```bash
https://github.com/Phongngohong08/certificate-manager.git
cd certificate-manager
```

### 2. Khởi động mạng Fabric
```bash
# Di chuyển đến thư mục test-network của Fabric
cd fabric-samples/test-network

# Dọn dẹp mạng cũ
./network.sh down

# Khởi động mạng với Leveldb
./network.sh up createChannel -ca

# Cài đặt và khởi tạo chaincode
./network.sh deployCC -ccn academic-certificates -ccp ../../certificate-manager/chaincode -ccl javascript
```

### 3. Cài đặt và chạy ứng dụng web

```bash
# Khởi động database
sudo systemctl start mongod

# Di chuyển đến thư mục web-app
cd ../../certificate-manager/web-app

# Cài đặt dependencies
npm install
or
npm install --only=dev

# Tạo file .env
touch .env
```

Thêm các biến môi trường sau vào file `.env` (nhớ thay đổi ccp_path):
```env
MONGODB_URI_LOCAL=mongodb://localhost:27017/blockchaincertificate
PORT=3000
LOG_LEVEL=info
EXPRESS_SESSION_SECRET=your-secret-key-here
CCP_PATH=/home/phongnh/go/src/github.com/Phongngohong08/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=academic-certificates
```

### 4. Chạy ứng dụng
```bash
# Chạy ở chế độ development
npm run start-development

# Nếu chạy React trên nhánh reactjs
git checkout reactjs
npm install
cd client
npm install
cd ..
npm run dev
```
Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000

## Cấu trúc dự án

- `chaincode/`: Chứa mã nguồn smart contract
- `web-app/`: Ứng dụng web frontend
- `resources/`: Tài nguyên và tài liệu

## Giấy phép

MIT License 

## Scripts

### Join Channel
```bash
npm run join-channel
```

Script này được sử dụng để kiểm tra và xác minh kết nối đến Hyperledger Fabric channel. Nó sẽ:

1. Kiểm tra kết nối đến channel
2. Hiển thị thông tin về channel:
   - Tên channel
   - Block height
   - Hash của block hiện tại và block trước đó
3. Hiển thị cấu hình channel:
   - Channel ID
   - Version
   - Orderer address
4. Liệt kê các peer đã join vào channel

Script này hữu ích khi:
- Kiểm tra xem channel đã được tạo chưa
- Xác minh quyền truy cập của admin vào channel
- Kiểm tra các peer đã join vào channel
- Debug các vấn đề về kết nối đến blockchain network

Nếu gặp lỗi, script sẽ hiển thị thông báo lỗi chi tiết để giúp xác định nguyên nhân:
- "channel not found": Channel chưa được tạo
- "access denied": Admin chưa có quyền truy cập
- "peer not found": Peer chưa join vào channel
