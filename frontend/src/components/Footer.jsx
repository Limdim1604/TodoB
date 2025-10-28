import React from "react";

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => { //nhận vào 2 props là completedTasksCount và activeTasksCount, với giá trị mặc định là 0 nếu ko có giá trị truyền vào
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {completedTasksCount > 0 && ( //nếu có nhiệm vụ đã hoàn thành thì hiển thị câu chúc mừng
              <>
                🎉 Tuyệt vời! Bạn đã hoàn thành {completedTasksCount} việc
                {activeTasksCount > 0 && //nếu vẫn còn việc dang dở thì hiển thị câu động viên
                  `, còn ${activeTasksCount} việc nữa thôi. Cố lên!`}
              </>
            )}

            {completedTasksCount === 0 && activeTasksCount > 0 && ( //ngược lại, chưa hoàn thành và có việc dang dở thì hiển thị câu hãy bắt đầu làm
              <>Hãy bắt đầu làm {activeTasksCount} nhiệm vụ nào!</>
            )}
          </p>
        </div>
      )}
    </>
  );
};

export default Footer;