import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true, //bắt buộc phải có tiêu đề khi tạo task
            trim: true, //mongoose tự loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        },
        status: {
            type: String,
            enum: ["active", "completed"], //status chỉ chấp nhận có 2 trạng thái này, ngoài ra thì ko hợp lệ
            default: "active", //mặc định khi tạo task mới thì status là active
        },
        completeAt: {
            type: Date,
            default: null, //mặc định là null vì khi tạo mới thì chưa hoàn thành nhiệm vụ, nếu status chuyển thành completed thì mới xét giá trị cho ngày hoàn thành
        },
    },
    {
        timestamps: true, //mongoose tự động tạo 2 trường createdAt và updatedAt để lưu thời gian tạo và cập nhật bản ghi
    }
);



//sau khi có schema thì tạo model để thao tác với collection tasks trong db
const Task = mongoose.model("Task", taskSchema); //nghĩa là từ tastSchema vừa định nghĩa, 
// ta tạo ra model tên là Task để thao tác với dữ liệu như là tạo mới, chỉnh sửa, xóa, lấy dữ liệu

export default Task; //xuất model Task ra để dùng ở chỗ khác
