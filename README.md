# Blockchain Academic Certificates

Dự án này triển khai một hệ thống quản lý chứng chỉ học thuật dựa trên blockchain sử dụng Hyperledger Fabric 2.5.13.

## Yêu cầu hệ thống

- Node.js phiên bản 20.x trở lên
- MongoDB phiên bản 6.0 trở lên
- Docker và Docker Compose
- Hyperledger Fabric 2.5.13 (đã cài đặt)
- Go phiên bản 1.20 trở lên

## Cài đặt các công cụ cần thiết

### 1. Cài đặt Node.js và npm
```bash
# Windows: Tải và cài đặt từ https://nodejs.org/
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Cài đặt MongoDB
```bash
# Windows: Tải và cài đặt từ https://www.mongodb.com/try/download/community
# Ubuntu/Debian:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3. Cài đặt Docker và Docker Compose
```bash
# Windows: Tải và cài đặt từ https://www.docker.com/products/docker-desktop
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

## Cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/your-username/blockchain-academic-certificates.git
cd blockchain-academic-certificates
```

### 2. Khởi động mạng Fabric
```bash
# Di chuyển đến thư mục test-network của Fabric
cd fabric-samples/test-network

# Khởi động mạng với CouchDB
./network.sh up createChannel -ca -c mychannel -s couchdb

# Cài đặt và khởi tạo chaincode
./network.sh deployCC -ccn academic-certificates -ccp ../../blockchain-academic-certificates/chaincode -ccl javascript
```

### 3. Cài đặt và chạy ứng dụng web

```bash
# Di chuyển đến thư mục web-app
cd ../../blockchain-academic-certificates/web-app

# Cài đặt dependencies
npm install
npm install --only=dev

# Tạo file .env
touch .env
```

Thêm các biến môi trường sau vào file `.env`:
```env
MONGODB_URI_LOCAL=mongodb://localhost:27017/blockchaincertificate
PORT=3000
LOG_LEVEL=info
EXPRESS_SESSION_SECRET=your-secret-key-here
CCP_PATH=/path/to/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json
FABRIC_CHANNEL_NAME=mychannel
FABRIC_CHAINCODE_NAME=academic-certificates
```

### 4. Chạy ứng dụng
```bash
# Chạy ở chế độ development
npm run start-development
```

Ứng dụng sẽ chạy tại địa chỉ: http://localhost:3000

## Cấu trúc dự án

- `chaincode/`: Chứa mã nguồn smart contract
- `web-app/`: Ứng dụng web frontend
- `resources/`: Tài nguyên và tài liệu

## Giấy phép

MIT License 