// import Task from '../models/Task.js'; 
// export const getAllTasks = async (req, res) => { 
//     try {
//         const tasks = await Task.find().sort({ createdAt: -1 }); //dùng model Task để truy vấn find() lấy tất cả các nhiệm vụ trong collection tasks, sort({ createdAt: -1 }) hoặc sort({createAt: 'desc'}) để xắp xếp từ dưới lên trên theo trường createdAt (mới nhất ở trên cùng), ngược vs desc là giảm dần, asc là tăng dần (or 1)
//         // throw new error("Ném cho code 1 lỗi thử"); 
//         res.status(200).json(tasks); //trả về mảng các nhiệm vụ dưới dạng json
//     } catch (error) {
//         console.error("Lỗi khi gọi getAllTasks:", error);
//         res.status(500).json({ message: "Lỗi hệ thống (server) khi lấy tất cả nhiệm vụ" });
//     }
// };
//DONE COPY
import Task from "../models/Task.js";//import model Task để thao tác với collection tasks trong db

export const getAllTasks = async (req, res) => {//thêm async vì đây là hàm bất đồng bộ, cần chờ kết quả từ db trả về
  const { filter = "today" } = req.query; //lấy filter từ query trên URL, nếu ko có thì mặc định là "today"
  const now = new Date(); //lấy ngày giờ hiện tại
  let startDate; //biến để lưu ngày bắt đầu dựa trên bộ lọc đc chọn

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 2025-08-24 00:00
      break;
    }
    case "week": { //lấy ngày thứ 2 của tuần hiện tại
      const mondayDate =
        now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month": { //lấy ngày đầu tiên của tháng hiện tại
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all": 
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {}; //gte là greater than or equal(>=), nếu có startDate thì tạo query để lọc nv có createdAt >= startDate, còn ko có startDate thì query rỗng (lấy tất cả nv)

  try {
    const result = await Task.aggregate([ //tức là mình đang dùng aggregation pipeline để thao tác với bảng tasks trong mongodb, aggregate nhận vào 1 mảng các bước xử lý dữ liệu, mỗi ptu trong mảng là 1 đối tượng, mỗi đối tượng là 1 bước (stage) trong pipeline
      { $match: query }, //pineline này sẽ chạy trước pineline facet bên dưới, dùng để lọc nv dựa trên query đã tạo ở trên (lọc theo ngày tạo nv)
      {
        $facet: { //mở một đối tượng vs dấu dola, facet 1 nhánh, sẽ cho chúng ta chạy nhiều pipeline song song rồi gom kết quả lại trong 1 lần truy vấn. tức ta can chạy nhiều việc cùng 1 lúc trong 1 nhánh, cụ thể ở đây là chạy 3 pipeline song song để lấy danh sách nhiệm vụ, đếm số nhiệm vụ active và đếm số nhiệm vụ complete
          tasks: [{ $sort: { createdAt: -1 } }], //pipeline đầu tiên để lấy danh sách nhiệm vụ, sắp xếp theo createdAt giảm dần (mới nhất ở trên cùng)
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }], //pipeline thứ 2 để đếm số nhiệm vụ đang hoạt động (active), đối tg thứ 2 là $count: "count", count đầu tiên là việc cần làm (là đếm), "count" thứ 2 là để nói vs mongodb trả về 1 mảng có key là count, nên khi lấy ra ta sẽ dùng result[0].activeCount[0].count để lấy số lượng nhiệm vụ active
          completeCount: [{ $match: { status: "complete" } }, { $count: "count" }], //pipeline thứ 3 để đếm số nhiệm vụ đã hoàn thành (complete)
        },
      },
    ]);
//kết quả trả về là result, là 1 mảng có 1 phần tử, phần tử này là 1 đối tượng có 3 key: tasks, activeCount, completeCount, từ kq này ta có thể trích ra dữ liệu mà ta cần

    const tasks = result[0].tasks; //lấy danh sách nhiệm vụ
    const activeCount = result[0].activeCount[0]?.count || 0; //lấy số lượng nhiệm vụ active, dùng optional chaining để tránh lỗi nếu mảng activeCount rỗng (ko có nhiệm vụ active nào), nếu rỗng thì gán giá trị mặc định là 0
    const completeCount = result[0].completeCount[0]?.count || 0; //lấy số lượng nhiệm vụ complete, dùng optional chaining để tránh lỗi nếu mảng completeCount rỗng (ko có nhiệm vụ complete nào), nếu rỗng thì gán giá trị mặc định là 0

    res.status(200).json({ tasks, activeCount, completeCount }); //gửi dữ liệu về frontend là 1 đối tượng có 3 trường: tasks, activeCount, completeCount
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};



export const createTask = async(req, res) => { //controller để tạo mới nhiệm vụ
    try {
        const { title } = req.body; //lấy title mà client gửi từ request body gửi lên, để đọc đc req.body thì phải dùng middleware express.json() ở server.js
        const task = new Task({ title }); //tạo mới 1 nhiệm vụ dựa trên model Task, truyền vào 1 đối tượng có trường title

        const newTask =  await task.save(); //lưu task mới xuống db, phải chờ kết quả trả về nên dùng await
        res.status(201).json(newTask); //trả về nhiệm vụ mới tạo dưới dạng json
    } catch (error) {
        console.error("Lỗi khi gọi createTask:", error);
        res.status(500).json({ message: "Lỗi hệ thống (server) khi tạo nhiệm vụ" });
    }

};
//thường thì khi tạo mới thành công sẽ trả về mã 201, khi dùng send thì có thể gửi đủ loại dữ liệu như chuỗi, số, đối tượng, ko nhất thiết là json. 
// còn khi dùng json thì nội dung bên trong phải viết dưới dạng json, và khi client nhận đc phản hồi thì sẽ hiểu là json luôn. API usu làm việc vs json

export const updateTask = async (req, res) => {
    try {
        const {title, status, completeAt} = req.body; //lấy dữ liệu mới từ request body gửi lên
        const updatedTask = await Task.findByIdAndUpdate( //dùng hàm findByIdAndUpdate của mongoose để tìm bằng id và cập nhật nv theo id, này là biến để lưu nhiệm vụ sau khi cập nhật để dễ test, nên ta phải có thói quen sau khi thao tác vs dữ liệu thì mình nên lưu kết quả trả về vào 1 biến, truyền vào 3 tham số
            req.params.id, //tham số 1: lấy id từ tham số đường dẫn (URL)
            { title, status, completeAt }, //tham số 2 chứa đối tượng mà mình muốn update: title, status, completedAt, 3 trường này lấy từ req.body
            { new: true } //tùy chọn true để sau khi update xong thì trả về giá trị sau khi cập nhật
        );

        if (!updatedTask) { //nếu ko tìm thấy nhiệm vụ để cập nhật, trong trường hợp client gửi id ko hợp lệ hay sao đó
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }

        res.status(200).json(updatedTask); //trả về nhiệm vụ đã được cập nhật dưới dạng json

    } catch (error) {
        console.error("Lỗi khi gọi updateTask:", error);
        res.status(500).json({ message: "Lỗi hệ thống (server) khi cập nhật nhiệm vụ" });
    }
};
//hiện mấy cái api chưa có logic thật vì ta chưa kết nối database, chỉ mới tạo mấy cái endpoint để test trc thôi nên chưa thể tạo hay update dữ liệu thật
//khi update nhiệm vụ thì mình phải biết nv đó là nv nào, cho nên client phải gửi kèm id của nv

export const deleteTask = async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndDelete(req.params.id); //tìm và xóa nv theo id từ tham số đường dẫn(URL)

        if (!deleteTask) { //nếu ko tìm thấy nhiệm vụ để xóa
            return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
        }
        res.status(200).json(deleteTask); //trả về nhiệm vụ đã bị xóa dưới dạng json

    } catch (error) {
        console.error("Lỗi khi gọi deleteTask:", error);
        res.status(500).json({ message: "Lỗi hệ thống (server) khi xóa nhiệm vụ" });
    }
};
