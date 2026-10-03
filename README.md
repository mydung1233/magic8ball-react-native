# 🎱 Magic 8 Ball - Quả cầu tiên tri (React Native + Expo)

Ứng dụng mô phỏng quả cầu tiên tri Magic 8 Ball

## ✨ Chức năng

- Giao diện gồm AppBar, hình quả cầu tiên tri, câu trả lời và nút **Hỏi quả cầu**.
- Hiển thị ảnh quả cầu từ thư mục `assets/ball/`.
- Sinh số ngẫu nhiên từ 1 đến 5 bằng `Math.random()`, đổi ảnh và văn bản tương ứng.
- Quản lý trạng thái bằng hook `useState`.

**Tính năng nâng cao**

- Hiệu ứng lắc ngang quả cầu (`Animated`), quả cầu quay về mặt số 8 trong lúc lắc.
- Lắc điện thoại để hỏi (`expo-sensors` - Accelerometer).
- Rung phản hồi khi lắc và khi có câu trả lời (`expo-haptics`).
- Lưu lịch sử 5 câu trả lời gần nhất, có nút bật/tắt chế độ lắc điện thoại.

## 🛠 Công nghệ sử dụng

- [React Native](https://reactnative.dev/)
- [Expo SDK](https://expo.dev/)
- `expo-sensors`, `expo-haptics`

## 📁 Cấu trúc thư mục

```
Magic8Ball/
├── assets/
│   └── ball/
│       ├── ball0.png   (mặt số 8, trạng thái ban đầu)
│       ├── ball1.png   (YES)
│       ├── ball2.png   (NO)
│       ├── ball3.png   (MAYBE)
│       ├── ball4.png   (ASK AGAIN)
│       └── ball5.png   (LIKELY)
├── screenshots/
├── App.js
├── app.json
├── package.json
└── README.md
```

## 🚀 Cài đặt và chạy

**Yêu cầu:** Node.js 18 trở lên, ứng dụng **Expo Go** trên điện thoại (hoặc emulator).

```bash
# 1. Clone dự án
git clone 
cd <repo>

# 2. Cài thư viện
npm install

# 3. Chạy ứng dụng
npx expo start
```

Sau đó quét mã QR bằng Expo Go, hoặc nhấn `a` (Android), `i` (iOS), `w` (web).

> Tính năng lắc điện thoại và rung chỉ hoạt động trên thiết bị thật.
