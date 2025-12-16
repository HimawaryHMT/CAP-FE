# Hướng dẫn Setup và Sử dụng chức năng Nhắc nhở uống nước

## 📋 Bước 1: Tạo Database

Chạy file SQL để tạo các bảng cần thiết:

```bash
mysql -u root -p elderly_monitoring < database_setup_water_intake.sql
```

Hoặc chạy trực tiếp trong MySQL:
```sql
SOURCE database_setup_water_intake.sql;
```

## 🚀 Bước 2: Khởi động Backend

```bash
cd Capstone_Ver1_BE
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5060`

## 📱 Bước 3: Khởi động Frontend

```bash
cd Capstone_Ver1
npm start
```

## ✅ Bước 4: Test chức năng

### 4.1. Đăng nhập vào app
- Đăng nhập với tài khoản của bạn
- User data sẽ được lưu tự động

### 4.2. Truy cập màn hình Nhắc nhở uống nước
- Từ HomePage, chọn "Nhắc nhở uống nước"
- Màn hình sẽ tự động load:
  - Mục tiêu uống nước hàng ngày (từ settings)
  - Lượng nước đã uống hôm nay
  - Số lần uống nước

### 4.3. Thêm lượng nước uống
- Nhấn nút **+** ở giữa để thêm lượng nước
- Lượng nước mặc định có thể điều chỉnh bằng nút chai nước bên phải
- Dữ liệu sẽ được lưu vào database tự động

### 4.4. Xem lịch sử và thống kê
- Nhấn nút "Lịch sử & Thống kê"
- Xem biểu đồ 7 ngày gần nhất
- Xem tổng lượng nước đã uống

## 🔧 API Endpoints

### Thêm bản ghi uống nước
```
POST /api/water-intake
Body: {
  "user_id": 1,  // optional
  "elderly_id": 1,  // optional
  "amount_ml": 200,
  "drink_time": "2025-01-XX..."  // optional, mặc định là now
}
```

### Lấy tổng lượng nước hôm nay
```
GET /api/water-intake/today?user_id=1
hoặc
GET /api/water-intake/today?elderly_id=1
```

### Lấy lịch sử uống nước
```
GET /api/water-intake/history?user_id=1&limit=50
```

### Lấy thống kê theo ngày
```
GET /api/water-intake/stats?user_id=1&days=7
```

### Lấy cài đặt
```
GET /api/water-intake/settings?user_id=1
```

### Cập nhật cài đặt
```
PUT /api/water-intake/settings
Body: {
  "user_id": 1,
  "daily_goal_ml": 2500,
  "default_amount_ml": 300,
  "reminder_enabled": true,
  "reminder_interval_minutes": 120
}
```

## 📊 Database Schema

### Bảng `water_intake_records`
- Lưu từng lần uống nước
- Các trường: id, user_id, elderly_id, amount_ml, drink_time

### Bảng `water_intake_settings`
- Lưu cài đặt của người dùng
- Các trường: daily_goal_ml, default_amount_ml, reminder_enabled, reminder_interval_minutes

## 🎨 Tính năng giao diện

### Màn hình chính
- ✅ Progress ring hiển thị % hoàn thành mục tiêu
- ✅ Thống kê nhanh: Mục tiêu, Lần gần nhất, Số lần
- ✅ Nút thêm/trừ lượng nước
- ✅ Điều chỉnh lượng nước mỗi lần uống
- ✅ Thay đổi mục tiêu hàng ngày

### Màn hình lịch sử
- ✅ Biểu đồ cột 7 ngày gần nhất
- ✅ Thống kê tổng lượng nước
- ✅ Hiển thị mục tiêu trên biểu đồ
- ✅ Medal cho ngày đạt mục tiêu

## 🐛 Xử lý lỗi

### Lỗi: "Không thể tải dữ liệu"
- Kiểm tra backend đã chạy chưa
- Kiểm tra database đã được tạo chưa
- Kiểm tra user_id/elderly_id có đúng không

### Lỗi: "Không thể lưu dữ liệu"
- Kiểm tra kết nối database
- Kiểm tra API endpoint
- Xem console logs để debug

## 📝 Lưu ý

1. **Database**: Phải chạy SQL script trước khi sử dụng
2. **User ID**: Hệ thống tự động lấy từ AsyncStorage sau khi đăng nhập
3. **Settings**: Tự động tạo mặc định nếu chưa có (goal: 2000ml, default: 200ml)
4. **Lịch sử**: Hiển thị 7 ngày gần nhất, có thể mở rộng

## 🎉 Hoàn thành!

Chức năng nhắc nhở uống nước đã được tích hợp đầy đủ với:
- ✅ Database để lưu trữ dữ liệu
- ✅ Backend API đầy đủ
- ✅ Frontend tích hợp với API
- ✅ Giao diện đẹp và thân thiện
- ✅ Lịch sử và thống kê




