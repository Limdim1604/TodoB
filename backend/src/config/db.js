import mongoose from 'mongoose';

export const connectDB = async () => { //connectDB là một hàm bất đồng bộ, chịu trách nghiệm mở kết nối đến cơ sở dữ liệu MongoDB, làm việc vs hàm bất đồng bộ thì phải dùng try và catch để bắt lỗi
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING); //truyền vào connection string để kết nối đến db, chuỗi này do mongo cung cấp khi tạo db trên atlas
        console.log("Kết nối đến MongoDB thành công");
    } catch (error) {
        console.error("Kết nối đến MongoDB thất bại:", error);
        process.exit(1); //đóng cổng database lại nếu kết nối thất bại, exit (0) là thoát vs trạng thái thành công, exit(1) là thoát vs trạng thái thất bại
    }
}