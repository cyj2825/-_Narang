import { useState, Fragment } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import MypageCalendar from "../components/Mypage/MypageCalendar";
import UserInfo from "../components/Mypage/UserInfo";
import SmallPlan from "../components/Mypage/SmallPlan";
import Mileage from "../components/Mypage/Mileage";
import MyBadge from "../components/Mypage/MyBadge";

const Mypage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <Fragment>
      <div className="grid w-full h-screen grid-cols-9 gap-5">
        <div className="col-span-6">
          <div className="my-3">
            <p className="mt-6 text-xl font-bold animate-bounce">🛫나의 여행기록🛬</p>
            <div className="flex items-center justify-center w-full">
              <span className="">날짜 선택</span>
          <DatePicker
            locale={ko}
            selectsRange={true}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            dateFormat="yy/MM/dd"
            todayButton="now"
            className="w-auto p-2 m-3 text-sm border rounded-sm border-neutral-300 text-neutral-700 placeholder:text-neutral-300"
          />
</div>
          <SmallPlan dates={[startDate, endDate]} />
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col">
            <UserInfo />
            <Mileage />
            <MyBadge />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Mypage;
