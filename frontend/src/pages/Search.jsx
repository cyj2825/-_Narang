import { Fragment, useState, useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";

import { ko } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Checkbox from "../ui/CheckBox";
import TripSummary from "../components/Trip/Read/TripSummary";

const SearchPage = () => {
  const conceptList = ["낭만", "건축", "모험", "자유", "쇼핑", "휴양", "핫플"];
  const continents = [
    "동아시아",
    "동남아시아",
    "중앙아시아",
    "서남아시아",
    "유럽",
    "오세아니아",
    "아프리카",
    "북아메리카",
    "남아메리카",
  ];
  const positionList = [
    "길잡이",
    "사진 도사",
    "운전 기사",
    "패션 요정",
    "지갑 전사",
    "기억 수호자",
    "여행 초보자",
    "언어 마법사",
    "푸드 파이터",
    "요리 강령술사",
    "여행 연금술사",
    "트렌드 사냥꾼",
  ];

  const [selectedContinents, setSelectedContinents] = useState([]);
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [participantsSize, setParticipantsSize] = useState(1); // Default to 1 person

  const [pageNo, setPageNo] = useState(0);
  const [tripData, setTripData] = useState([]);

  // 날짜 포맷
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [requestData, setRequestData] = useState({
    tripConcept: conceptList,
    tripRoles: positionList,
    tripContinent: continents,
    participantsSize: 0,
    querySttDate: formatDate(new Date()),
  });

  const { ref, inView } = useInView({
    threshold: 0, // div태그가 보일 때 inView가 true로 설정
  });

  const getBoardList = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/page/available`,
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

  // 날짜 변경
  const handleDateChange = (range) => {
    setTripData([]);
    setPageNo(0);
    setDateRange(range);

    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      querySttDate: range[0] ? formatDate(range[0]) : formatDate(new Date()),
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
      querySttDate: formatDate(new Date()),
      queryEndDate: "2030-12-31",
    }));
  };

  // 인원 변경
  const handleParticipantsSize = (event) => {
    setTripData([]);
    setPageNo(0);
    // 선택된 값이 없으면 0으로 설정
    const size = event.target.value ? parseInt(event.target.value, 10) : 0;
    setParticipantsSize(size);

    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      participantsSize: size,
    }));
  };

  // 대륙 체크박스 변경 핸들러
  const handleContinentChange = (continent) => {
    setTripData([]);
    setPageNo(0);

    const newSelectedContinents = selectedContinents.includes(continent)
      ? selectedContinents.filter((c) => c !== continent)
      : [...selectedContinents, continent];

    setSelectedContinents(newSelectedContinents);
    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      tripContinent:
        newSelectedContinents.length === 0 ? continents : newSelectedContinents,
    }));
  };

  // 컨셉 체크박스 변경 핸들러
  const handleConceptChange = (concept) => {
    setTripData([]);
    setPageNo(0);

    const newSelectedConcepts = selectedConcepts.includes(concept)
      ? selectedConcepts.filter((c) => c !== concept)
      : [...selectedConcepts, concept];

    setSelectedConcepts(newSelectedConcepts);

    // 컨셉 체크 여부에 따라 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      tripConcept:
        newSelectedConcepts.length === 0 ? conceptList : newSelectedConcepts,
    }));
  };

  // 포지션 체크박스 변경 핸들러
  const handlePositionChange = (position) => {
    setTripData([]);
    setPageNo(0);

    const newSelectedPositions = selectedPositions.includes(position)
      ? selectedPositions.filter((p) => p !== position)
      : [...selectedPositions, position];

    setSelectedPositions(newSelectedPositions);

    // 요청 데이터 업데이트
    setRequestData((prevData) => ({
      ...prevData,
      tripRoles: newSelectedPositions,
    }));
  };

  // inView가 true일때 데이터를 가져옴
  useEffect(() => {
    // inView가 true일때 데이터를 가져옴
    if (inView) {
      getBoardList();
    }
  }, [inView, requestData]);

  return (
    <Fragment>
      <div className="grid grid-cols-10 gap-1">
        <div className="col-span-8">
          {tripData.length === 0 ? (
            <p>해당 조건에 맞는 모집글이 없습니다.</p>
          ) : (
            <div className="flex flex-wrap justify-start">
              {tripData.map((trip, idx) => (
                <TripSummary trip={trip} key={idx} />
              ))}
            </div>
          )}
          <div ref={ref}></div>
        </div>
        <div className="col-span-2">
          <div className="flex justify-around mb-2 itmes-center">
            <div className="mr-1">날짜</div>
            <DatePicker
              isClearable
              locale={ko}
              selectsRange={true}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={handleDateChange}
              onClear={handleDateClear}
              dateFormat="yy/MM/dd"
              minDate={new Date()}
              className="p-1 text-sm border rounded-sm w-44 border-neutral-300 text-neutral-700"
            />
          </div>
          <div className="w-full my-3 border-2 border-neutral-300" />
          <div className="flex items-center justify-around mb-2">
            <div className="mr-1">인원</div>
            <select
              value={participantsSize}
              onChange={handleParticipantsSize}
              className="p-1 text-sm border rounded-sm w-44 border-neutral-300 text-neutral-700"
            >
              {[...Array(12).keys()].map((value) => (
                <option key={value} value={value + 1}>
                  {value + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full my-3 border-2 border-neutral-300" />
          <div>장소(대륙)</div>
          <div className="flex flex-col items-start p-1 text-neutral-700">
            {continents.map((continent) => (
              <Checkbox
                key={continent}
                label={continent}
                checked={selectedContinents.includes(continent)}
                onChange={() => handleContinentChange(continent)}
              />
            ))}
          </div>
          <div className="w-full my-3 border-2 border-neutral-300" />
          <div>컨셉</div>
          <div className="flex flex-col items-start p-1 text-neutral-700">
            {conceptList.map((concept) => (
              <Checkbox
                key={concept}
                label={concept}
                checked={selectedConcepts.includes(concept)}
                onChange={() => handleConceptChange(concept)}
              />
            ))}
          </div>
          <div className="w-full my-3 border-2 border-neutral-300" />
          <div>포지션</div>
          <div className="flex flex-col items-start p-1 text-neutral-700">
            {positionList.map((position) => (
              <Checkbox
                key={position}
                label={position}
                checked={selectedPositions.includes(position)}
                onChange={() => handlePositionChange(position)}
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SearchPage;
