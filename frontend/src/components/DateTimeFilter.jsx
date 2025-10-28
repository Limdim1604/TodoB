
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { options } from "@/lib/data";

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=""
        > 
          {dateQuery
            ? options.find((option) => option.value === dateQuery)?.label
            : options[0].label} {/*nếu dateQuery có giá trị thì tìm trong mảng options cái ptu có value trùng với dateQuery rồi lấy label hiển thị ra, còn ko có thì hiển thị label của ptu đầu tiên trong mảng options*/}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => { //khi ngdung chọn 1 ptu trong danh sách thì hàm onSelect sẽ đc gọi, currentValue là giá trị value của ptu đc chọn
                    setDateQuery(currentValue); //cập nhật state dateQuery với giá trị đc chọn
                    setOpen(false); //đóng popover sau khi chọn xong
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      dateQuery === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DateTimeFilter;