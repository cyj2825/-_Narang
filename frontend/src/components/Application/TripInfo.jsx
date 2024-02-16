import { Fragment, useState, useEffect } from "react";
import { SlCalender, SlLocationPin, SlPeople, SlBadge } from "react-icons/sl";
import { RiArrowDropDownLine } from "react-icons/ri";


import DateFormatter from "../DateFormatter";
import ReceivedList from "./ReceivedList";
import { useNavigate } from "react-router-dom";

export default function TripInfo({ tripData }) {
  // 내가 작성한 글 목록 -> 드롭다운 버튼으로 신청자 목록 확인 가능하도록

  // true면 해당 글의 신청목록 보여주고, false면 닫음
  const [viewOpen, setViewOpen] = useState(false);

  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const navigate = useNavigate();
  // 신청자 목록 확인 가능하도록
  const handleViewClick = () => {
    setViewOpen(!viewOpen);
  };

  useEffect(() => {
    // 날짜 포맷 설정
    setDepartureDate(DateFormatter({ dateString: tripData.departureDate }));
    setReturnDate(DateFormatter({ dateString: tripData.returnDate }));
  }, [tripData]);

  const clickHandler = (tripId) => {
    navigate(`/detail/${tripId}`);
  };

  return (
    <Fragment>
      {tripData && (
      <div className="w-full text-center rounded-l">
        <ul>
          <button
            onClick={handleViewClick}
            className="w-9/12 px-4 py-2 mx-auto my-2 border rounded-3xl border-stone-400"
          >
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center col-span-1">
                <img src={tripData.tripImgUrl} className="w-40 h-32 rounded-3xl" />
              </div>
              <div className="col-span-2">
                <button onClick={() => clickHandler(tripData.tripId)} className="my-1.5 text-sm font-bold text-center">
                  {tripData.tripName}
                </button>
                <div className="flex flex-row items-center my-1.5 text-sm">
                  <SlCalender className="mx-3 " size="24" />
                  <div>
                    {" "}
                    {departureDate} ~ {returnDate}{" "}
                  </div>
                </div>
                <div className="flex flex-row items-center my-1.5 text-sm">
                  <SlLocationPin className="mx-3 " size="24" />
                  <div> {tripData.continent}, {tripData.country}, {tripData.city}</div>
                </div>
              </div>
            </div>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              viewOpen ? " opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {viewOpen && <ReceivedList tripData={tripData} />}
          </div>
        </ul>
      </div>
      )}
    </Fragment>
  );
}
