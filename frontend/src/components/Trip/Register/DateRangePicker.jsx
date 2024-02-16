import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";


export default function DateRangePicker({ dateRange, onChange }) {
  return (
    <div className="w-full my-2">
      <label className="mr-10 text-base font-medium">여행 기간</label>
      <DatePicker
        showIcon
        locale={ko}
        selectsRange={true}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onChange={onChange}
        minDate={new Date()} // 과거 날짜 disable
        dateFormat="yy/MM/dd"
        className="w-full p-2 text-sm border rounded-sm border-neutral-300 text-neutral-700 placeholder:text-neutral-300"
      />
    </div>
  );
}
