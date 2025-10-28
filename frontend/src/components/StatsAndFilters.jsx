
import React from 'react';
import { FilterType } from '@/lib/data';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';


export const StatsAndFilters = ({completedTasksCount = 0, activeTasksCount = 0, filter = "all", setFilter,}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:item-center">
      {/* Phần thống kê và số lg nv*/}
      <div className="flex gap-3">
        <Badge
          variant="secondary"
          className="bg-white/50 text-accent-foreground border-info/20"
          >
            {activeTasksCount} {FilterType.active} {/* nghĩa là sẽ hiển thị số nv đang làm kèm chữ đang làm*/}
        </Badge>

        <Badge
          variant="secondary"
          className="bg-white/50 text-success border-success/20"
          >
            {completedTasksCount} {FilterType.completed} {/* nghĩa là sẽ hiển thị số nv đã hoàn thành kèm chữ đã hoàn thành*/}
        </Badge>
      </div>

      {/* Phần filter*/}
      <div className="flex flex-col gap-2 sm:flex-row"> {/*Trong div này lập qua từng loại filter trong filterType bởi vì filtertype là 1 đối tượng*/}
          {Object.keys(FilterType).map((type) => (
            <Button
              key={type}
              variant={filter === type ? "gradient" : "ghost"}
              size="sm"
              className="capitalize"
              onClick={() => setFilter(type)} //khi bấm nút thì gọi hàm setFilter truyền vào loại filter tương ứng
            >
              <Filter className="size-4" />
              {FilterType[type]}
            </Button>
          ))}

      </div>





    </div>
  );
};

export default StatsAndFilters;