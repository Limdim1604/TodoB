
export const FilterType = {
  all: "tất cả",
  active: "đang làm",
  completed: "hoàn thành",
};
//2:11:35
export const options = [ //mỗi đối tượng trong mảng bao gồm value tiếng anh để code backend cho tiện, label tiếng việt để hiển thị lên UI
  {
    value: "today",
    label: "Hôm nay",
  },
  {
    value: "week",
    label: "Tuần này",
  },
  {
    value: "month",
    label: "Tháng này",
  },
  {
    value: "all",
    label: "Tất cả",
  },
];

export const visibleTaskLimit = 4; //số lượng nhiệm vụ hiển thị tối đa trên 1 trang