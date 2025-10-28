
import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  const deleteTask = async (taskId) => { //hàm này để xoá nhiệm vụ, nhận vào tham số taskId là id của nhiệm vụ cần xoá, và vì nó gọi API nên là hàm bất đồng bộ, nên dùng async, bên trong dùng try catch để bắt lỗi khi gọi API
    try {
      await api.delete(`/tasks/${taskId}`); //await để chờ phản hồi từ API sau khi gửi yêu cầu xoá nhiệm vụ theo id
      toast.success("Nhiệm vụ đã xoá.");
      handleTaskChanged(); //gọi cái này để thông báo lên component cha là ds nv đã thay đổi, để component cha gọi lại API lấy ds nv mới nhất
    } catch (error) {
      console.error("Lỗi xảy ra khi xoá task.", error);
      toast.error("Lỗi xảy ra khi xoá nhiệm vụ mới.");
    }
  };

  const updateTask = async () => { //hàm này để gọi API cập nhật lại nv, vì hàm này chạy khi ngdung nhấn enter rồi nên ta cần thoát khỏi chế độ edit, sau đó mới gọi API
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`, { //gọi API update nv theo id hiện tại, vs object trong body chỉ có trường title lấy từ state updateTaskTitle
        title: updateTaskTitle,
      });
      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`);
      handleTaskChanged();//gọi cái này để thông báo lên component cha là ds nv đã thay đổi, để component cha gọi lại API lấy ds nv mới nhất
    } catch (error) {
      console.error("Lỗi xảy ra khi update task.", error);
      toast.error("Lỗi xảy ra khi cập nhập nhiệm vụ.");
    }
  };

  const toggleTaskCompleteButton = async () => { //hàm này để xử lý khi ngdung click vào nút đánh dấu hoàn thành/chưa hoàn thành nhiệm vụ thì sẽ gọi API để cập nhật trạng thái nhiệm vụ
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, { //nếu nv hiện tại là active thì gọi api.put để đổi trạng thái thành complete và gán completedAt là thời gian hiện tại
          status: "complete",
          completedAt: new Date().toISOString(),//chuyển đổi thời gian hiện tại sang chuỗi định dạng ISO(giờ quốc tế) để lưu vào db
        });

        toast.success(`${task.title} đã hoàn thành.`);
      } else {
        await api.put(`/tasks/${task._id}`, {//nếu nv hiện tại là complete thì gọi api.put để đổi trạng thái thành active và gán completedAt là null
          status: "active",
          completedAt: null,
        });
        toast.success(`${task.title} đã đổi sang chưa hoàn thành.`);
      }

      handleTaskChanged();//xong hết thì gọi cái này để refresh lại ds nv ở component cha
    } catch (error) {
      console.error("Lỗi xảy ra khi update task.", error);
      toast.error("Lỗi xảy ra khi cập nhập nhiệm vụ.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTask();
    }
  };

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "complete" && "opacity-75" // if nhiệm vụ hoàn thành thì mờ đi
      )}
      style={{ animationDelay: `${index * 50}ms` }} /* mỗi item sẽ render chậm hơn 50ms để tạo hiệu ứng xuất hiện dần dần chứ ko xuất hiện cùng 1 lúc*/
    >
      <div className="flex items-center gap-4">
        {/* nút tròn để đánh dấu nv đã hoàn thành hay chưa*/}
        <Button
          variant="ghost"
          size="icon"
          className={cn( //flex-shrink-0 để nút ko bị co trên kthuoc màn hình nhỏ, size-8 để nút to hơn, rounded-full để nút tròn, transition-all duration-200 để tạo hiệu ứng chuyển đổi mượt mà
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete" // nếu nv đã hoàn thành thì nút màu xanh lá, ngược lại thì màu xám
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskCompleteButton} //gọi hàm toggleTaskCompleteButton khi ngdung click nút tròn này
        >
          {task.status === "complete" ? ( //hiển thị icon khác nhau dựa trên trạng thái nhiệm vụ
            <CheckCircle2 className="size-5" /> //checkcircle2 lấy từ lucide-react, là icon có dấu tích bên trong
          ) : (
            <Circle className="size-5" /> //circle là icon hình tròn rỗng lấy từ lucide-react
          )}
        </Button>




        {/* hiển thị hoặc chỉnh sửa tiêu đề của task*/}
        <div className="flex-1 min-w-0"> {/* flex-1 để chiếm toàn bộ không gian còn lại, min-w-0 để tránh tràn khi nội dung quá dài*/}
          {isEditting ? ( //nếu đang ở chế độ chỉnh sửa thì hiển thị input để chỉnh sửa tiêu đề
            <Input
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20" //flex-1 để input chiếm toàn bộ không gian còn lại, h-12 để tăng chiều cao input, text-base để cỡ chữ vừa phải, border-border/50 để viền có màu nhạt, focus:border-primary/50 và focus:ring-primary/20 để khi focus vào input thì viền và bóng có màu chủ đạo
              type="text"
              value={updateTaskTitle} //giá trị của input lấy từ state updateTaskTitle đã tạo ở trên
              onChange={(e) => setUpdateTaskTitle(e.target.value)} //mỗi khi ngdung nhập gì vào input thì hàm này sẽ đc gọi, e (viết tắt của event) là đối tượng sự kiện, e.target là phần tử input, e.target.value là giá trị hiện tại trong ô input, hàm này sẽ lấy giá trị đó và cập nhật vào state updateTaskTitle thông qua hàm setUpdateTaskTitle
              onKeyPress={handleKeyPress} //hàm này copy từ addTask.jsx qua, tạo ở trên, để khi ngdung nhấn enter thì sẽ gọi hàm updateTask để lưu thay đổi, siêng thì đem hàm này vào lib rồi cần sài thì import vào cx đc
              onBlur={() => { //onBlur là 1 event handler đc kích hoạt khi input mất focus (ngdung click ra ngoài hoặc chuyển sang phần tử khác), khi đó ta sẽ lưu thay đổi và thoát chế độ chỉnh sửa
                setIsEditting(false); //để hiện lại thẻ p hiển thị tiêu đề nhiệm vụ
                setUpdateTaskTitle(task.title || ""); //reset lại tiêu đề trong ô input về tiêu đề ban đầu của nhiệm vụ, phòng trường hợp ngdung chỉnh sửa xong rồi click ra ngoài mà ko nhấn enter để lưu, thì ta sẽ ko lưu thay đổi đó mà giữ nguyên tiêu đề ban đầu
              }}
            />
          ) : (
            <p //ngược lại nếu ko edit thì hiển thị 1 thẻ p để hiển thị tiêu đề nhiệm vụ
              className={cn(
                "text-base transition-all duration-200", //transition-all để tạo hiệu ứng chuyển đổi mượt mà, duration-200 để thiết lập thời gian chuyển đổi
                task.status === "complete"
                  ? "line-through text-muted-foreground" //nếu task = complete thì chữ sẽ bị gạch ngang bằng line-through và màu chữ nhạt đi bằng text-muted-foreground
                  : "text-foreground" //ngược lại thì chữ có màu bình thường, mấy cái như -foreground là ở bên index.css định nghĩa sẵn rồi
              )}
            >
              {task.title} {/* hiển thị tiêu đề nhiệm vụ */}
            </p>
          )}

          {/* ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1"> {/* flex để các item bên trong nằm ngang, items-center để canh giữa theo chiều dọc, gap-2 để tạo khoảng cách giữa các item, mt-1 để tạo khoảng cách phía trên */}
            <Calendar className="size-3 text-muted-foreground" /> {/* icon lịch nhỏ từ lucide-react ở bên trái, text-muted-foreground để màu chữ nhạt */}
            <span className="text-xs text-muted-foreground"> 
              {new Date(task.createdAt).toLocaleString()}  {/* chuyển đổi chuỗi ngày tháng sang định dạng dễ đọc và vietnam hơn bằng toLocaleString()  */}
            </span>
            {task.completedAt && ( //nếu nhiệm vụ đã hoàn thành thì ms hiển thị ngày hoàn thành, cú pháp này dùng thư viện clsx trong shadcn
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" /> {/* icon lịch nhỏ từ lucide-react ở bên trái, text-muted-foreground để màu chữ nhạt */}
                <span className="text-xs text-muted-foreground"> {/* thẻ span hiển thị ngày hoàn thành bằng toLocaleString() */}
                  {new Date(task.completedAt).toLocaleString()} {/* chuyển đổi chuỗi ngày tháng sang định dạng dễ đọc và vietnam hơn bằng toLocaleString()  */}
                </span>
              </>
            )}
          </div>
        </div>

        {/* nút chỉnh và xoá */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up"> {/* ẩn 2 nút này đi, chỉ hiện khi pt cha có class group đc hover vào thì nó sẽ hiện ra bằng inline-flex và animate-slide-up để có hiệu ứng trượt lên khi xuất hiện*/}
          {/* nút edit */}
          <Button
            variant="ghost" /* nút kiểu ghost là nút trong suốt chỉ có viền và icon */
            size="icon" /* nút kích thước icon là nút vuông chỉ vừa khít với icon bên trong */
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info" /* flex-shrink-0 để nút ko bị co lại, transition-colors để tạo hiệu ứng chuyển đổi màu mượt mà, size-8 để nút to hơn, text-muted-foreground để màu chữ nhạt, hover:text-info để khi hover vào nút thì chữ chuyển sang màu info */
            onClick={() => { //khi bấm nút thì chuyển sang chế độ chỉnh sửa
              setIsEditting(true);//để hiện ra ô nhập
              setUpdateTaskTitle(task.title || ""); //nếu task.title có giá trị thì gán vào updateTaskTitle, ngược lại thì gán chuỗi rỗng
            }}
          >
            <SquarePen className="size-4" /> {/* icon bút chì từ lucide-react */}
          </Button>

          {/* nút xoá */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive" /* hover:text-destructive để khi hover vào nút thì chữ chuyển sang màu destructive (màu đỏ) */
            onClick={() => deleteTask(task._id)} //gọi hàm deleteTask khi bấm nút, truyền vào id của nhiệm vụ cần xoá
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;