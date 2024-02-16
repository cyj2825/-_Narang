import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import moment from "moment";
import colors from "tailwindcss/colors";
import { GoDotFill } from "react-icons/go";

import "../../css/Calendar.css";

// 체크용 더미데이터 실제로는 axios.get을 통해 api통신으로 받아올 예정
const CalendarCp = () => {
  const { conceptColor } = useSelector((state) => state.concept);
  const dynamicColor = colors[conceptColor]
    ? colors[conceptColor][400]
    : colors.gray[400];
  const [value, setValue] = useState(new Date());
  const [activeDate, setActiveDate] = useState(null); // 클릭한 날짜를 저장할 상태
  const navigate = useNavigate();
  const addContent = ({ date }) => {
    // 해당 날짜(하루)에 추가할 컨텐츠의 배열
    const contents = [];
    const formattedDate = moment(date).format("YYYY-MM-DD");
  };

  const onClickDayHandler = (value, event) => {
    setActiveDate(moment(value).format("YYYY-MM-DD")); // 클릭한 날짜를 상태에 저장
    if (event.target.textContent.includes("😂")) {
      navigate("/search");
    }
  };

  const tileClassName = ({ date, view }) => {
    // 월 보기에서만 스타일 적용
    if (view === "month") {
      const dayOfWeek = date.getDay();
      const formattedDate = moment(date).format("YYYY-MM-DD");
      let additionalClass = "";
      if (activeDate === formattedDate) {
        additionalClass += " active";
      }
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        additionalClass += " weekend-day"; // 주말 날짜에 적용할 클래스
      }

      return additionalClass;
    }
  };

  useEffect(() => {
    setActiveDate(moment(value).format("YYYY-MM-DD"));
    const style = document.createElement("style");
    style.innerHTML = `.react-calendar__navigation { color: ${dynamicColor}; }`;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [dynamicColor]);

  return (
    <div className="flex items-center justify-center w-full ">
      <Calendar
        calendarType="gregory"
        onChange={setValue}
        value={value}
        next2Label={null}
        prev2Label={null}
        formatDay={(locale, date) => moment(date).format("D")}
        minDate={new Date(2024, 0, 1)}
        tileContent={addContent}
        showNeighboringMonth={false}
        onClickDay={onClickDayHandler}
        tileClassName={tileClassName}
      />
    </div>
  );
};

export default CalendarCp;
