import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import AgeRangeSection from "./AgeRangeSlider.jsx";
import TitleInput from "./TitleInput.jsx";
import ConceptSelect from "./ConceptSelect.jsx";
import DateRangePicker from "./DateRangePicker.jsx";
import PositionCheck from "./PositionCheck.jsx";
import { ModalPortal } from "../../modals/ModalPortal.jsx";
import ContinentModal from "../../modals/ContinentModal.jsx";
import PlanModal from "../../modals/PlanModal.jsx";

export default function TripWriteForm() {
  const userId = useSelector((state) => state.auth.userId);
  const [planName, setPlanName] = useState("");

  const [board, setBoard] = useState({
    title: "",
    concept: "낭만",
    img: "",
    continent: "",
    country: "",
    city: "",
    ageUpperBound: 7,
    ageLowerBound: 2,
    startDate: "",
    endDate: "",
    dateRange: "",
    count: 2,
    myPosition: [],
    recruitPosition: [],
    planId: "",
    description: "",
    deposit: 0,
    tripPlanId: "",
  });

  const [imgUrl, setImgUrl] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [isPlanOpen, setIsPlanOpen] = useState(false);

  const navigate = useNavigate();

  // 값이 변할 때 추적하기 위한 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoard((prevBoard) => ({ ...prevBoard, [name]: value }));
  };

  const [dateRange, setDateRange] = useState([null, null]);
  // 기간 변할 때 추적하는 함수
  const handleDateChange = (range) => {
    setDateRange(range);
    setBoard((board) => ({
      ...board,
      startDate: range[0],
      endDate: range[1],
      dateRange: range,
    }));
  };

  // 선택된 대륙 정보 업데이트 함수
  const handleContinentChange = (selectedContinent) => {
    setBoard((board) => ({
      ...board,
      continent: selectedContinent,
    }));
  };

  // 선택된 국가 정보 업데이트 함수
  const handleCountryChange = (selectedCountry) => {
    setBoard((board) => ({
      ...board,
      country: selectedCountry,
    }));
  };

  // 선택된 도시 정보 업데이트 함수
  const handleCityChange = (selectedCity) => {
    setBoard((board) => ({
      ...board,
      city: selectedCity,
    }));
  };

  const handlePlanChange = (selectedPlan) => {
    setBoard((board) => ({
      ...board,
      tripPlanId: selectedPlan,
    }));
  };

  const handlePlanNameChange = (selectedPlanName) => {
    setPlanName(selectedPlanName);
  };

  // 이미지 input이 변경될 때 호출되는 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setBoard((board) => ({
      ...board,
      img: file,
    }));

    setImgUrl(URL.createObjectURL(file));
  };

  // 모달 open
  const OpenLocaitonModal = () => {
    // claer 해주고
    setBoard((board) => ({
      ...board,
      continent: "",
      country: "",
      city: "",
    }));

    setIsOpen(true);
  };

  // 모달 close
  const CloseLocationModal = () => {
    setIsOpen(false);
  };

  const OpenPlanModal = () => {
    setIsPlanOpen(true);
  };

  const ClosePlanModal = () => {
    setIsPlanOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData();

    const requestData = {
      tripName: board.title,
      tripDesc: board.description,
      continent: board.continent,
      country: board.country,
      city: board.city,
      tripAgeUpperBound: board.ageUpperBound,
      tripAgeLowerBound: board.ageLowerBound,
      tripParticipantsSize: board.count,
      tripDeposit: board.deposit,
      leaderRoles: board.myPosition,
      tripConcept: board.concept,
      tripRoles: board.recruitPosition,
      departureDate: board.startDate,
      returnDate: board.endDate,
      participants: [],
      tripLeaderId: userId,
      tripPlanId: board.tripPlanId
    };

    try {
      // 이미지 파일이 선택되었을 경우에만 추가
      if (board.img) {
        formData.append("tripImg", board.img);
      }

      // 나머지 데이터 추가
      formData.append(
        "tripRequest",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );

      // 데이터를 서버로 전송
      const response = await axios.post(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 저장 후 이동할 페이지로 이동
      navigate(`/detail/${response.data.tripId}`);
    } catch (error) {
      console.error("서버 응답 에러", error);
    }
  };

  useEffect(() => {
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Fragment>
      <div className="text-left">
        <form onSubmit={handleSubmit}>
          <div className="w-9/12 px-8 py-4 mx-auto border rounded-xl border-stone-200">
            <div className="grid grid-cols-3 gap-6 px-4">
              <div className="col-span-3">
                <p className="my-2 text-2xl font-bold text-center">
                  동행 글 작성하기
                </p>
              </div>
              <div className="flex flex-col justify-between col-span-2">
                <TitleInput value={board.title} onChange={handleChange} />
                <ConceptSelect value={board.concept} onChange={handleChange} />
                <DateRangePicker
                  dateRange={dateRange}
                  onChange={handleDateChange}
                />
                <div className="w-full my-2">
                  <label className="mr-10 text-base font-medium">
                    여행 장소
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="장소를 선택해주세요"
                    value={
                      board.continent
                        ? `${board.continent}, ${board.country}, ${board.city}`
                        : ""
                    }
                    onClick={OpenLocaitonModal}
                    className="border rounded-sm border-neutral-300  p-1.5 w-2/3 text-neutral-700 placeholder:text-neutral-300 text-sm"
                    readOnly
                  ></input>
                  {isOpen && (
                    <ModalPortal>
                      <ContinentModal
                        onClose={CloseLocationModal}
                        onSelectedContinent={handleContinentChange}
                        onSelectedCountry={handleCountryChange}
                        onSelectedCity={handleCityChange}
                      />
                    </ModalPortal>
                  )}
                </div>
                <div className="flex w-full my-2">
                  <label className="mr-10 text-base font-medium">
                    모집 연령
                  </label>
                  <AgeRangeSection
                    upperBound={board.ageUpperBound}
                    lowerBound={board.ageLowerBound}
                    onRangeChange={(left, right) => {
                      setBoard((prev) => ({
                        ...prev,
                        ageUpperBound: right,
                        ageLowerBound: left,
                      }));
                    }}
                  />
                </div>
                <div className="w-full my-2">
                  <label className="mr-10 text-base font-medium">
                    모집 인원
                  </label>
                  <input
                    type="number"
                    name="count"
                    value={board.count}
                    onChange={handleChange}
                    required
                    className="border rounded-sm border-neutral-300 p-1.5 w-1/6 text-neutral-700 placeholder:text-neutral-300 text-sm mr-10"
                    min={2}
                    max={12}
                  />
                  <label className="mr-10 text-base font-medium">예약금</label>
                  <input
                    type="number"
                    name="deposit"
                    placeholder="&#8361; 20,000"
                    value={board.deposit}
                    onChange={handleChange}
                    required
                    step="1000"
                    min={0}
                    className="border rounded-sm border-neutral-300 p-1.5 w-1/4 text-neutral-700 placeholder:text-neutral-300 text-sm"
                  />
                </div>
                <label className="text-base">내 포지션</label>
                <PositionCheck
                  value={board.myPosition}
                  onChange={(positions) =>
                    setBoard((prev) => ({ ...prev, myPosition: positions }))
                  }
                />
                <label className="text-base">모집 포지션</label>
                <PositionCheck
                  value={board.recruitPosition}
                  onChange={(positions) =>
                    setBoard((prev) => ({
                      ...prev,
                      recruitPosition: positions,
                    }))
                  }
                />
                <div className="w-full my-2">
                  <label className="mr-10 text-base font-medium">
                    여행 계획표
                  </label>
                  <input
                    type="text"
                    name="planId"
                    placeholder="계획을 선택해주세요"
                    value={planName}
                    onClick={OpenPlanModal}
                    className="border rounded-sm border-neutral-300  p-1.5 w-2/3 text-neutral-700 placeholder:text-neutral-300 text-sm"
                    readOnly
                  ></input>
                  {isPlanOpen && (
                    <ModalPortal>
                      <PlanModal
                        onClose={ClosePlanModal}
                        onSelectedPlanId={handlePlanChange}
                        onSelectedPlanName={handlePlanNameChange}
                      />
                    </ModalPortal>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-between col-span-1">
                <div className="h-2/5">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      className="my-1 h-3/4"
                      alt="Selected Image"
                    />
                  ) : (
                    <img
                      src="assets/airplain.jpg"
                      className="my-1 h-3/4"
                      alt="Default Image"
                    />
                  )}
                  <label className="text-sm font-medium">여행 이미지</label>
                  <br />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="text-xs"
                    accept="image/*"
                  />
                </div>
                <div className="h-3/5">
                  <label className="text-sm font-medium">여행 설명</label>
                  <br />
                  <textarea
                    value={board.description}
                    onChange={handleChange}
                    className="w-full text-xs  rounded-sm resize-none h-4/5 p-1.5 border border-neutral-300 ext-neutral-700"
                    name="description"
                  />
                </div>
              </div>
              <div className="flex justify-around col-start-2 mt-10 mb-5">
                <button className="px-6 py-2 text-indigo-700 rounded-md bg-indigo-50 ring-1 ring-inset ring-indigo-700/10 hover:bg-indigo-100">
                  저장
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
}
