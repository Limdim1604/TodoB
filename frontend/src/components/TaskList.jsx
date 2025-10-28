
import React from "react";
import TaskEmptyState from "./TaskEmptyState";
import TaskCard from "./TaskCard";

const TaskList = ({ filteredTasks, filter, handleTaskChanged }) => {
  if (!filteredTasks || filteredTasks.length === 0) {
    return <TaskEmptyState filter={filter} />;
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <TaskCard
          key={task._id ?? index}
          task={task}
          index={index}
          handleTaskChanged={handleTaskChanged} //truyền hàm này xuống để khi nv thay đổi (hoàn thành, sửa, xóa) thì taskcard sẽ gọi lại hàm này để homepage biết và lấy lại ds nv mới nhất
        />
      ))}
    </div>
  );
};

export default TaskList;