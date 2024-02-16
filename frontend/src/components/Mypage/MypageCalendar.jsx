import { useState } from "react";

const MypageCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const prevMonth = new Date(currentMonth);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  const getMonthData = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const data = [];
    const startDay = startDate.getDay();

    // Add empty slots for the previous month
    for (let i = 0; i < startDay; i++) {
      data.push(null);
    }

    // Add days for the current month
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      data.push(new Date(date));
    }

    return data;
  };

  const renderCalendar = (month) => {
    const year = month.getFullYear();
    const monthData = getMonthData(year, month.getMonth());

    return (
      <div className="flex-col">
        <div className="mx-4 h-1/6">
          {`${month.getFullYear()}년 ${month.getMonth() + 1}월`}
        </div>
        <div className="h-5/6">
          <div className="grid grid-cols-7 gap-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <div key={index} className="text-center px-2 border">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-2">
            {monthData.map((date, index) => (
              <div
                key={index}
                className={`text-center px-2 border ${
                  date ? "" : "text-gray-500"
                }`}
              >
                {date ? date.getDate() : ""}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(nextMonth);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth);
  };

  const handleGoToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="w-3/5">
      <button className="text-black px-2" onClick={handlePrevMonth}>
        {"<"}
      </button>
      <button className="text-black px-2" onClick={handleGoToCurrentMonth}>
        now
      </button>
      <button className="text-black px-2" onClick={handleNextMonth}>
        {">"}
      </button>
      <div className="flex justify-around">
        {renderCalendar(currentMonth)}
        {renderCalendar(nextMonth)}
      </div>
    </div>
  );
};

export default MypageCalendar;
