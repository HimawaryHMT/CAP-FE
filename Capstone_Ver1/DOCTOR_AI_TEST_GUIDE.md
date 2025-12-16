# Hướng dẫn Test chức năng Doctor AI

## 🎯 Cách test trên giao diện

### Bước 1: Khởi động Backend
```bash
cd Capstone_Ver1_BE
npm run dev
# Hoặc
npm start
```

Server sẽ chạy tại: `http://localhost:5060`

### Bước 2: Khởi động Frontend
```bash
cd Capstone_Ver1
npm start
# Sau đó chọn platform (a cho Android, i cho iOS, w cho web)
```

### Bước 3: Đăng nhập
1. Mở app và đăng nhập với tài khoản của bạn
2. Sau khi đăng nhập thành công, user data sẽ được lưu tự động

### Bước 4: Truy cập màn hình Doctor AI
1. Tìm và mở màn hình **"Bác Sĩ AI"** trong app
2. Bạn sẽ thấy:
   - Banner giới thiệu
   - Danh sách bác sĩ chuyên khoa
   - Các câu hỏi thường gặp

### Bước 5: Test chat với Doctor AI
1. **Cách 1**: Chọn một câu hỏi thường gặp từ danh sách
2. **Cách 2**: Nhấn vào bất kỳ bác sĩ chuyên khoa nào
3. **Cách 3**: Nhập câu hỏi trực tiếp vào ô chat

### Bước 6: Thử các câu hỏi mẫu
- "Tôi bị đau đầu, phải làm sao?"
- "Tôi bị sốt, nên làm gì?"
- "Tôi bị ho, có cách nào chữa không?"
- "Tôi bị đau bụng, nguyên nhân là gì?"
- "Tôi bị cảm lạnh, làm sao để nhanh khỏi?"
- "Tôi bị mất ngủ"
- "Tôi bị chóng mặt"

## 📱 Các tính năng đã tích hợp

### ✅ Backend API
- `POST /api/doctor-ai/chat` - Chat với Doctor AI
- `GET /api/doctor-ai/history` - Lấy lịch sử chat
- `GET /api/doctor-ai/conditions` - Lấy danh sách bệnh thường gặp

### ✅ Frontend
- Màn hình chat với Doctor AI
- Tự động gửi câu hỏi và nhận phản hồi
- Hiển thị loading khi đang xử lý
- Xử lý lỗi và hiển thị thông báo
- Lưu user_id và elderly_id tự động

## 🔍 Kiểm tra hoạt động

### Kiểm tra Backend
1. Mở terminal backend, bạn sẽ thấy log:
   ```
   🤖 [Doctor AI] Nhận câu hỏi: Tôi bị đau đầu
   👤 User ID: 1, Elderly ID: null
   ✅ Đã lưu lịch sử chat: 123
   ```

### Kiểm tra Frontend
1. Mở DevTools/Console của app
2. Bạn sẽ thấy log khi gọi API
3. Kiểm tra response từ server

## 🐛 Xử lý lỗi

### Lỗi: "Không thể kết nối đến server"
- Kiểm tra backend đã chạy chưa
- Kiểm tra BASE_URL trong `config.js` có đúng IP không
- Kiểm tra firewall/network

### Lỗi: "Lỗi server khi xử lý câu hỏi"
- Kiểm tra backend logs
- Kiểm tra database connection
- Kiểm tra JWT_SECRET trong file `.env`

### Không nhận được phản hồi
- Kiểm tra network connection
- Kiểm tra API endpoint có đúng không
- Xem console logs để debug

## 📝 Lưu ý

1. **Database**: Bảng `doctor_ai_chat_history` là optional. Nếu chưa tạo, hệ thống vẫn hoạt động bình thường nhưng không lưu lịch sử.

2. **User ID**: Hệ thống tự động lấy user_id từ AsyncStorage sau khi đăng nhập.

3. **Knowledge Base**: Hiện tại có 10 bệnh/triệu chứng thường gặp. Có thể mở rộng thêm trong file `doctorAIController.js`.

## 🎉 Test thành công khi:
- ✅ Gửi câu hỏi và nhận được phản hồi từ Doctor AI
- ✅ Phản hồi có nội dung tư vấn phù hợp
- ✅ Hiển thị loading khi đang xử lý
- ✅ Xử lý lỗi đúng cách khi có sự cố

