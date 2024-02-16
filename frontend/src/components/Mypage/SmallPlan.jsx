import { Fragment, useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import axios from "axios";

import TripSummaryMini from "../Trip/Read/TripSummaryMini";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/DatePicker.css";

const SmallPlan = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [tripData, setTripData] = useState([]);

  const userId = useSelector((state) => state.auth.userId);
  const [requestData, setRequestData] = useState({
    userId: userId,
  });

  const { ref, inView } = useInView({
    threshold: 0, // div태그가 보일 때 inView가 true로 설정
  });

  const getMyList = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trips`,
        { pageNo: pageNo, ...requestData },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 가져올 항목이 없으면 중단
      if (response.data.content.length === 0) {
        return;
      }

      // 새로운 데이터를 기존 데이터에 추가
      setTripData((prevData) => [...prevData, ...response.data.content]);

      // 페이지 번호 증가
      setPageNo((prevPageNo) => prevPageNo + 1);
    } catch (error) {
      console.error("여행 목록을 가져오는 중 에러 발생:", error);
    }
  }, [pageNo, requestData]);

  // 날짜 포맷
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 변경
  const handleDateChange = (range) => {
    setTripData([]);
    setPageNo(0);

    setDateRange(range);
    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      querySttDate: range[0] ? formatDate(range[0]) : "1970-01-01",
      queryEndDate: range[1] ? formatDate(range[1]) : "2030-12-31",
    }));
  };

  // 날짜 clear 이벤트 핸들러
  const handleDateClear = () => {
    setTripData([]);
    setPageNo(0);

    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      querySttDate: "1970-01-01",
      queryEndDate: "2030-12-31",
    }));
  };

  // inView가 true일때 데이터를 가져옴
  useEffect(() => {
    if (inView) {
      getMyList();
    }
  }, [inView, requestData, userId]);

  // 날짜 포함하면
  return (
    <Fragment>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="m-3 text-xl font-bold">🛫나의 여행기록🛬</div>
        <DatePicker
          isClearable
          locale={ko}
          selectsRange={true}
          startDate={dateRange[0]}
          endDate={dateRange[1]}
          onChange={handleDateChange}
          onClear={handleDateClear}
          dateFormat="yy/MM/dd"
          monthsShown={2}
          inline
          className=""
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {tripData.map((trip, idx) => (
          <TripSummaryMini trip={trip} key={idx} />
        ))}
      </div>
      <div ref={ref}></div>
    </Fragment>
  );
};

export default SmallPlan;
