# Blockchain Academic Certificates

Dự án này triển khai một hệ thống quản lý chứng chỉ học thuật dựa trên blockchain sử dụng Hyperledger Fabric 2.2.19.

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
