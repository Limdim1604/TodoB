
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const TaskListPagination = ({
  handleNext,
  handlePrev,
  handlePageChange,
  page,
  totalPages,
}) => {
  const generatePages = () => { //hàm để sinh ra số trang hiển thị, tức xác định phần phân trang của chúng ta trông ntn, tức khi nào nên thêm dấu "..." và khi nào nên hiển thị toàn bộ số trang
    const pages = [];

    if (totalPages < 4) { // nếu tổng số trang nhỏ hơn 4 thì hiển thị toàn bộ số trang
      // hiện toàn bộ
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else { //nếu tổng số trang lớn hơn hoặc bằng 4 thì ta sẽ hiển thị có chọn lọc với dấu "..."
      if (page <= 2) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 1) { //nếu page hiện tại đang ở gần cuối (là totalPages-1 hoặc totalPages) thì hiển thị 3 trang cuối cùng
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else { //nếu page hiện tại ở giữa (ko phải gần đầu hoặc gần cuối) thì hiển thị trang đầu tiên, dấu "...", trang hiện tại, dấu "...", trang cuối cùng
        pages.push(1, "...", page, "...", totalPages);
      }
    }

    return pages;
  };

  const pagesToShow = generatePages(); //gọi hàm để lấy mảng các trang cần hiển thị

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          {/* Trước */}
          <PaginationItem>
            <PaginationPrevious
              onClick={page === 1 ? undefined : handlePrev} //nếu ở trang 1 thì ko làm gì hết, nếu ko thì gọi hàm handlePrev để chuyển trang trước, thêm style mờ và ko cho bấm khi ở trang 1
              className={cn( //cn để kết hợp các lớp lại theo điều kiện
                "cursor-pointer", //nghĩa là khi lướt vào thì hiện con trỏ ra
                page === 1 && "pointer-events-none opacity-50" //nếu đang ở trang 1 thì thêm lớp pointer-events-none để ko cho bấm vào nút, và opacity-50 để làm mờ nút đi, sở dĩ phải làm cách này là vì cái paginationPrevious này là 1 component, ko phải là thẻ nút button bình thường, nên ko có thuộc tính disabled, cho nên ta dùng cách này để làm nút cảm giác "ko bấm đc" khi ở trang 1
              )}
            />
          </PaginationItem>

          {pagesToShow.map((p, index) => ( //sau khi đã có những trang để hiển thị thì chúng ta chỉ cần lọc qua các item trong pagesToShow rồi hiển thị component tương ứng, ta lọc mảng bằng hàm map, với p là số trang hoặc dấu "...", index là chỉ số của phần tử trong mảng
            <PaginationItem key={index}> {/* key là thuộc tính bắt buộc khi lặp mảng trong react, để giúp react theo dõi các phần tử trong danh sách 1 cách hiệu quả */}
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink //cần 2 props là isActive để biết trang hiện tại có đang đc chọn hay ko, nếu có thì highlight nó, và onClick để xử lý khi bấm vào số trang
                  isActive={p === page} //nếu p (số trang hiện tại trong vòng lặp) bằng với page (trang hiện tại đang hiển thị) thì isActive là true, ngược lại là false
                  onClick={() => { 
                    if (p !== page) handlePageChange(p); //nếu p khác page thì mới gọi hàm handlePageChange để chuyển trang, nếu p bằng page thì ko làm gì hết vì đang ở trang đó rồi
                  }}
                  className="cursor-pointer" //hiển con trỏ khi lướt vào cho dễ click
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Sau */}
          <PaginationItem>
            <PaginationNext
              onClick={page === totalPages ? undefined : handleNext} //nếu đang ở trang cuối cùng thì ko làm gì hết(mờ nút ko ấn đc), nếu ko thì gọi hàm handleNext để chuyển trang tiếp theo
              className={cn(
                "cursor-pointer",
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPagination;