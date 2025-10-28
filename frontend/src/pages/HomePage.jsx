
import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]); //buffer trong lập trình là chỗ để gom dữ liệu lại trước khi xử lý, nên ở đây mình dùng để lưu trữ tạm thời danh sách nhiệm vụ lấy từ API, vs giá trị ban đầu là mảng rỗng
  const [activeTaskCount, setActiveTaskCount] = useState(0); //tạo state để lưu giá trị của activeCount, setActiveTaskCount là hàm để cập nhật giá trị của activeTaskCount, giá trị mặc định gán là 0
  const [completeTaskCount, setCompleteTaskCount] = useState(0); //tạo state để lưu giá trị của completeCount
  const [filter, setFilter] = useState("all"); //state để lưu bộ lọc hiện tại, mặc định là "all" (tất cả nhiệm vụ)
  const [dateQuery, setDateQuery] = useState("today"); //state để quản lý giá trị hiện tại mà ngdung chọn trong combo box
  const [page, setPage] = useState(1);

  //để cho hàm fetchTasks chạy mỗi khi trang homepage load thì dùng useEffect, nó thường theo dõi 1 hoặc nhiều state, mỗi khi state trong danh sách dependencies thay đổi thì hàm useEffect sẽ chạy lại logic bên trong, còn trường hợp dependencies là mảng rỗng tức là ko theo dõi state nào hết, thì hàm useEffect sẽ chỉ chạy 1 lần khi component được mount (load/render) lần đầu tiên
  useEffect(() => {
    fetchTasks(); //chạy 1 lần duy nhất khi component được render lần đầu
  }, [dateQuery]); //thêm dateQuery vào dependencies của useEffect, để mỗi khi ngdung chọn bộ lọc ngày khác thì hàm fetchTasks sẽ đc gọi lại để lấy ds nv mới theo bộ lọc ngày đã chọn

// mỗi khi filter hoặc dateQuery thay đổi thì ta muốn đặt lại page về 1, vì khi đổi bộ lọc hoặc ngày thì ds nv hiển thị có thể thay đổi, nên ta cần quay về trang đầu tiên để tránh trường hợp trang hiện tại ko còn nhiệm vụ nào để hiển thị nữa

  useEffect(() => { //theo dõi sự thay đổi của filter or dateQuery để lỡ sang trang nào đó mà nó ko hiện nv hoàn thành (bug 2:34:38)
    setPage(1);
  }, [filter, dateQuery]);

  // logic
  const fetchTasks = async () => { //hàm này để lấy danh sách nhiệm vụ từ API dựa trên bộ lọc ngày đã chọn
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`); //gửi yêu cầu GET đến endpoint /tasks với query filter lấy từ state dateQuery để lọc nhiệm vụ theo ngày, nhớ đổi nháy đôi thành nháy ngược ` ` để dùng đc template literal trong js
      setTaskBuffer(res.data.tasks); //cập nhật taskBuffer với danh sách nhiệm vụ nhận được từ API, lưu ý là res.data.tasks vì API trả về 1 đối tượng có key là tasks chứa mảng nhiệm vụ
      setActiveTaskCount(res.data.activeCount); //cập nhật số lượng nhiệm vụ active từ API trả về
      setCompleteTaskCount(res.data.completeCount); //cập nhật số lượng nhiệm vụ complete từ API trả về
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks."); //toast import từ sonner để hiển thị thông báo lỗi nếu việc lấy nhiệm vụ thất bại, dùng toast bởi vì nó cung cấp trải nghiệm người dùng tốt hơn so với việc chỉ ghi lỗi vào console
    }
  };

  const handleTaskChanged = () => { //hàm này sẽ đc truyền xuống các component con như AddTask, TaskList, mỗi khi có thay đổi trong ds nv (thêm, sửa, xóa) thì các component con sẽ gọi lại hàm này để homepage biết là ds nv đã thay đổi và cần lấy lại ds nv mới nhất từ server
    fetchTasks();
  };

//3 hàm handler để di chuyển trang
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // biến, ở đây ta muốn lọc ds nv theo trạng thái nên sẽ tạo biến filteredTasks lấy mảng TaskBuffer rồi gọi hàm filter trên nó, cài xong ta sẽ có 1 mảng filteredTasks chứa ds nv đã đc lọc theo trạng thái
  //why ta ko dùng state mà dùng biến ở đây, vì mỗi lần homepage render lại thì ta cũng muốn biến này đc tính toán lại dựa trên giá trị hiện tại của filter và taskBuffer, nếu dùng state thì sẽ phải quản lý việc cập nhật state mỗi khi filter hoặc taskBuffer thay đổi, điều này làm code phức tạp hơn và có thể dẫn đến các vấn đề về hiệu suất nếu ko cẩn thận
  const filteredTasks = taskBuffer.filter((task) => { //filter sẽ chạy qua từng task 1 trong mảng taskBuffer
    switch (filter) {
      case "active":
        return task.status === "active"; //nếu bộ lọc là "active" thì chỉ giữ lại những nhiệm vụ có status là "active"
      case "completed":
        return task.status === "complete"; //nếu bộ lọc là "completed" thì chỉ giữ lại những nhiệm vụ có status là "complete"
      default:
        return true; //nếu bộ lọc là "all" hoặc bất kỳ giá trị nào khác thì giữ lại tất cả nhiệm vụ, ko lọc gì hết
    }
  });

  //[0,1,2,3,4].slice(0,3) => [0,1,2]
  const visibleTasks = filteredTasks.slice( //lấy các nhiệm vụ để hiển thị trên trang hiện tại dựa trên phân trang, visibleTaskLimit là số lượng nhiệm vụ hiển thị trên mỗi trang, đc import từ lib/data.js. trong js thì hàm slice(start, end) sẽ lấy các ptu từ vị trí start đến vị trí end-1 trong mảng
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit //tức là lấy từ vị trí (page-1)*limit đến vị trí page*limit -1, ví dụ đang ở page 3, limit=4 thì sẽ lấy từ vị trí 8 đến vị trí 11 (4 nhiệm vụ: 8,9,10,11)
  ); //lấy ra các nhiệm vụ cần hiển thị trên trang hiện tại dựa trên phân trang

  //khi xóa nv mà ko còn nv nào trên trang đó thì phải quay lại trang trước thay vì báo ko còn nv trên trang hiện tại 
  if (visibleTasks.length === 0) {
    handlePrev();
  } //nếu ko có nhiệm vụ nào để hiển thị trên trang hiện tại (có thể do xóa nhiệm vụ) thì tự động chuyển về trang trước đó

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit); //tính tổng số trang dựa trên số lượng nhiệm vụ đã lọc và giới hạn nhiệm vụ hiển thị trên mỗi trang, dùng Math.ceil để làm tròn lên vì nếu có nhiệm vụ lẻ thì vẫn cần thêm 1 trang để hiển thị

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      {/* Dreamy Sky Pink Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(120deg, #d5c5ff 0%, #a7f3d0 50%, #f0f0f0 100%)"
        }}
      />
      {/* Your Content/Components */}
      <div className="container relative z-10 pt-8 mx-auto">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu Trang */}
          <Header />


          {/* Tạo Nhiệm Vụ */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />


          {/* Thống Kê và Bộ lọc */}
          <StatsAndFilters //truyền các props cần thiết vào component StatsAndFilters để hiển thị thống kê và bộ lọc
            filter={filter} //truyền bộ lọc hiện tại vào component StatsAndFilters để nó biết đang ở chế độ lọc nào (tất cả, đang làm, đã hoàn thành)
            setFilter={setFilter} //truyền hàm setFilter để component StatsAndFilters có thể thay đổi bộ lọc hiện tại khi người dùng chọn bộ lọc khác
            activeTasksCount={activeTaskCount} //truyền số lượng nhiệm vụ active vào component StatsAndFilters để hiển thị
            completedTasksCount={completeTaskCount} //truyền số lượng nhiệm vụ complete vào component StatsAndFilters để hiển thị
          />


          {/* Danh Sách Nhiệm Vụ */}
          <TaskList
            filteredTasks={visibleTasks} //truyền danh sách nhiệm vụ đã lọc và phân trang vào component TaskList để hiển thị
            filter={filter} //truyền bộ lọc hiện tại vào component TaskList để nó biết đang ở chế độ lọc nào (tất cả, đang làm, đã hoàn thành)
            handleTaskChanged={handleTaskChanged} //truyền hàm handleTaskChanged vào component TaskList để nó có thể gọi lại hàm này khi có thay đổi trong danh sách nhiệm vụ (như thêm, sửa, xóa nhiệm vụ) nhằm cập nhập lại danh sách nhiệm vụ hiển thị
          />


          {/* Phân Trang và Lọc Theo Date */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination //truyền các props cần thiết vào component TaskListPagination để hiển thị phân trang
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter //truyền các props cần thiết vào component DateTimeFilter để hiển thị bộ lọc ngày
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}
            />
          </div>


          {/* Chân Trang, cũng truyền các props cần thiết vào component Footer để hiển thị thống kê */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount} //completedTasksCount là tên props trong component Footer.jsx, còn completeTaskCount là tên biến state trong HomePage.jsx
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;