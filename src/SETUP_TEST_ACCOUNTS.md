# Hướng dẫn tạo Test Accounts

## Tạo Test Account trong Supabase Dashboard

Để tạo test accounts cho việc phát triển và testing:

### Bước 1: Truy cập Supabase Dashboard
1. Mở Supabase Dashboard tại https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào phần **Authentication** > **Users**

### Bước 2: Tạo Test Student Account
1. Click nút **"Add user"** > **"Create new user"**
2. Điền thông tin:
   - **Email**: `test@engmastery.com`
   - **Password**: `test123`
   - **Auto Confirm User**: ✅ BẬT (quan trọng!)
3. Click **"Create user"**

### Bước 3: Tạo Test Teacher Account (tùy chọn)
1. Click nút **"Add user"** > **"Create new user"**
2. Điền thông tin:
   - **Email**: `teacher@engmastery.com`
   - **Password**: `test123`
   - **Auto Confirm User**: ✅ BẬT (quan trọng!)
3. Click **"Create user"**

## Sử dụng Test Account

Sau khi tạo test account trong Supabase Dashboard:

1. Vào trang đăng nhập của EngMastery
2. Click nút **"Dùng tài khoản test"** để tự động điền thông tin
3. Hoặc nhập thủ công:
   - Email: `test@engmastery.com`
   - Password: `test123`
4. Click **"Đăng nhập"**

## Troubleshooting

### Lỗi "Invalid login credentials"
- **Nguyên nhân**: Test account chưa được tạo trong Supabase
- **Giải pháp**: Làm theo Bước 1-2 ở trên để tạo test account

### Lỗi "Email not confirmed"
- **Nguyên nhân**: Quên bật "Auto Confirm User" khi tạo user
- **Giải pháp**: 
  1. Xóa user cũ trong Supabase Dashboard
  2. Tạo lại user mới và nhớ ✅ bật "Auto Confirm User"

### Profile không tồn tại
- **Nguyên nhân**: User được tạo trong Supabase Auth nhưng profile chưa được tạo trong KV store
- **Giải pháp**: Server sẽ tự động tạo profile mặc định khi đăng nhập lần đầu

## Tạo Test Account qua Signup Flow (Khuyến nghị)

Thay vì tạo thủ công trong Dashboard, bạn nên sử dụng signup flow của ứng dụng:

1. Vào trang đăng ký
2. Điền thông tin:
   - Họ và tên: `Test User`
   - Email: `test@engmastery.com`
   - Mật khẩu: `test123`
   - Khối lớp: `6`
3. Click **"Đăng ký"**

Cách này đảm bảo:
- User được tạo đúng trong Supabase Auth
- Profile được tạo trong KV store
- Progress được khởi tạo
- Tất cả permissions được set đúng

## Xóa Test Account

Nếu cần xóa test account:

1. Vào Supabase Dashboard > Authentication > Users
2. Tìm user với email `test@engmastery.com`
3. Click menu (...) > **"Delete user"**
4. Xác nhận xóa

**Lưu ý**: Sau khi xóa user, bạn cần tạo lại nếu muốn tiếp tục test.
