import express from 'express';
import { createTask, deleteTask, getAllTasks, updateTask } from '../controllers/tasksControllers.js';


const router = express.Router(); //tạo 1 router riêng để khai báo các endpoint liên quan đến tasks

//Bộ tứ endpoint: CRUD - Create (post), Read(get), Update(put/patch), Delete(delete)

//app.get để lắng nghe 1 request dạng get để lấy dữ liệu, app.get là khi có yêu cầu get gửi đến địa chỉ endpoint thì server sẽ trả về dữ liệu
router.get("/", getAllTasks); //khi có request get gửi đến /api/tasks thì sẽ gọi hàm getAllTasks ở trong controllers

//tạo thêm vài cái endpoint nữa, vd nếu muốn tạo 1 nhiệm vụ mới thì cần gửi post request lên server
router.post("/", createTask); //dùng ctrl + space để gợi ý import hàm createTask từ controllers phía đầu file

router.put("/:id", updateTask); //dùng put để cập nhật toàn bộ thông tin của nhiệm vụ, còn patch là cập nhật 1 phần thông tin nào đó thôi);

router.delete("/:id", deleteTask);
//xóa nv cx cần id để biết xóa nv nào


export default router;