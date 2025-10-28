//DONE COPY
import express from 'express';
import taskRoute from './routes/tasksRouters.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";

dotenv.config(); //cấu hình để đọc biến môi trường từ file .env



const PORT = process.env.PORT || 5001; //lấy cổng từ biến môi trường, nếu ko có trong env thì mặc định là 5001
const __dirname = path.resolve();


const app = express();
//middleware
app.use(express.json()); //middleware để phân tích cú pháp json từ request body gửi lên server

if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" })); //chỉ cho phép yêu cầu từ frontend chạy trên cổng 5173 (cổng mặc định của Vite) trong môi trường phát triển, còn nếu muốn cho phép tất cả domain gọi API thì dùng app.use(cors()) thôi, khi deploy thực tế thì thường back và font thường chạy cùng 1 domain
} //sử dụng middleware cors để cho phép các yêu cầu từ frontend (chạy trên cổng khác) có thể truy cập API của backend mà ko bị chặn bởi chính sách cùng nguồn (same-origin policy)




app.use("/api/tasks", taskRoute); //để khai báo là mình muốn sử dụng API trong tệp tasksRouters.js


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}



connectDB().then(() => { //connectDB trả về 1 promise nên ta dùng then để chờ kết nối db thành công r mới bắt đầu lắng nghe request từ client gửi đến
    app.listen(PORT, () => {
    console.log(`server đã bắt đầu trên cổng ${PORT}`);
});
}); //gọi hàm kết nối db trc khi server lắng nghe request từ client gửi đến


