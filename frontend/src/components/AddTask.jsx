
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios"; //import đối tượng api từ file axios.js trong thư mục lib, đối tượng này đã đc cấu hình sẵn baseURL và các thiết lập khác để gọi API dễ dàng hơn

const AddTask = ({ handleNewTaskAdded }) => {//component nhận vào 1 prop là hàm handleNewTaskAdded, hàm này sẽ đc gọi sau khi nhiệm vụ mới đc thêm thành công, để thông báo cho component cha (homepage) biết là có nhiệm vụ mới đc thêm vào, còn xử lý như nào là tùy thuộc vào component cha
  const [newTaskTitle, setNewTaskTitle] = useState(""); //state để lưu tiêu đề nhiệm vụ mới mà ngdung nhập vào, giá trị mặc định là chuỗi rỗng
  const addTask = async () => { //hàm để gửi yêu cầu lên server để thêm task mới, dùng async vì có thao tác bất đồng bộ là gọi API
    if (newTaskTitle.trim()) { //trim để loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi, nếu sau khi trim mà chuỗi ko rỗng thì mới tiến hành gọi API phòng trhop ngdung nhập chuỗi toàn khoảng trắng
      try {
        await api.post("/tasks", { title: newTaskTitle }); //gửi yêu cầu POST đến endpoint /tasks với dữ liệu trong body là 1 đối tượng chứa trường title lấy từ state newTaskTitle
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào.`);
        handleNewTaskAdded(); //hàm gọi lại truyền từ cha xuống con, để thông báo cho component cha (homepage) biết là có nhiệm vụ mới đc thêm vào, từ đó homepage sẽ gọi lại API để lấy ds nv mới nhất
      } catch (error) {
        console.error("Lỗi xảy ra khi thêm task.", error);
        toast.error("Lỗi xảy ra khi thêm nhiệm vụ mới.");
      }

      setNewTaskTitle("");//dù thành công hay thất bại thì sau khi thêm xong ta cũng nên reset ô input về chuỗi rỗng để ngdung dễ nhập nhiệm vụ mới
    } else {//nếu ngdung chưa nhập gì thì mình chạy khối else này
      toast.error("Bạn cần nhập nội dung của nhiệm vụ.");
    }
  };

  const handleKeyPress = (event) => { //hàm này để xử lý sự kiện khi ngdung nhấn phím trong ô input, event là đối tượng sự kiện đc react truyền tự động vào hàm handler mỗi khi có sự kiện xảy ra, ở đây ta kiểm tra nếu phím đc nhấn là "Enter" thì sẽ gọi hàm addTask để thêm nhiệm vụ mới
    if (event.key === "Enter") { //event.key là thuộc tính chứa tên phím đc nhấn, nếu ngdung nhấn phím Enter thì ta gọi hàm addTask, thay vì bắt họ phải click chuột vào nút thêm, thì họ chỉ nhập rồi nhấn enter cho nhanh cx đc, lúc đó ta cx tạo nv mới luôn
      addTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">{/* Đây là component của shadcn(ngoài ra còn có Button,...), gradient card và custom lg là 2 giá trị ta tạo trong index.css đó*/ }
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
          value={newTaskTitle}
          onChange={(even) => setNewTaskTitle(even.target.value)} //đây là hàm gọi lại, mỗi khi ngdung nhập gì vào ô input thì hàm này sẽ đc gọi, even là đối tượng sự kiện, even.target là phần tử input, even.target.value là giá trị hiện tại trong ô input(kiểm soát nội dung hiển thị trong ô, ví dụ ngdung nhấn enter thì ô  về lại rỗng, cho nên mình cần gán giá trị value bằng giá trị của state, khi reset state thì ô cx đc reset ), hàm này sẽ lấy giá trị đó và cập nhật vào state newTaskTitle thông qua hàm setNewTaskTitle
          onKeyPress={handleKeyPress} //onKeyPress là 1 event handler đc kích hoạt khi ngdung gõ phím trong ô input, hàm handleKeyPress sẽ kiểm tra nếu phím đc nhấn là "Enter" thì sẽ gọi hàm addTask để thêm nhiệm vụ mới
        />

        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask} //gọi hàm addTask khi ngdung click nút thêm
          disabled={!newTaskTitle.trim()} //nút thêm sẽ bị vô hiệu hóa (ko bấm đc) nếu ô input rỗng hoặc chỉ chứa khoảng trắng, vì newTaskTitle.trim() sẽ trả về chuỗi rỗng nếu ko có ký tự nào ngoài khoảng trắng, và !chuỗi rỗng sẽ là true, nên nút sẽ bị disabled
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;