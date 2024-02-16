import { useState, useMemo } from "react";
import {
  SlCalender,
  SlLocationPin,
  SlInfo,
  SlPeople,
  SlEye,
} from "react-icons/sl";
import { useNavigate } from "react-router-dom";
import DateFormatter from "../../DateFormatter";

const TripSummaryMain = ({ trip }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const { departureDate, returnDate } = useMemo(
    () => ({
      departureDate: DateFormatter({ dateString: trip.departureDate }),
      returnDate: DateFormatter({ dateString: trip.returnDate }),
    }),
    [trip.departureDate, trip.returnDate]
  );

  const tripDescShortened = useMemo(() => {
    return trip.tripDesc.length > 16 ? trip.tripDesc.slice(0, 15) + "..." : trip.tripDesc;
  }, [trip.tripDesc]);

  const handleViewClick = () => {
    navigate(`/detail/${trip.tripId}`);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="w-12/12 rounded-l ">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleViewClick}
        className="flex px-3 py-4 mx-3 my-4 align-top border rounded-3xl shadow-lg border-stone-400 border-r-4 border-b-4"
      >
        <div className="grid grid-cols-2 gap-1">
          <div className="relative overflow-hidden group rounded-3xl col-span-1">
            <img
               src={trip.tripImgUrl}
               alt="tripThumbnail"
               className="mb-2 transition-transform duration-300 ease-in-out transform scale-100 w-[15rem] h-[9rem] rounded-3xl group-hover:scale-125"
            />
            {isHovered && (
              <div className="absolute inset-0 flex flex-col items-end justify-end bg-black text-neutral-800 bg-opacity-20">
                <div
                  className="flex flex-row items-center my-1 mr-2 text-xs font-semibold"
                  style={{ whiteSpace: "nowrap", minWidth: "100px" }}
                >
                  <SlPeople className="mx-1" size="12" />
                  <p className="text-xs">2 / {trip.tripParticipantsSize}</p>
                  <SlEye className="mx-1" size="12" />
                  <p className="text-xs">{trip.viewCnt}</p>
                </div>
              </div>
            )}
          </div>
          <div className="col-span-1 ">
            <div className="flex flex-row items-center my-3 text-sm">
              <SlCalender className="mx-1" size="24" />
              <div className="flex-grow text-center">
                <p className="text-xs">
                  {departureDate} ~ {returnDate}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center my-3 text-sm">
              <SlLocationPin className="mx-" size="20" />
              <div className="flex-grow text-center">
                <p className="text-xs">
                  {trip.country},
                  <br />
                  {trip.city}
                </p>
              </div>
              <p className="text-xs"></p>
            </div>
            <div className="flex flex-row items-center my-3 text-sm ">
              <SlInfo className="mx-1 " size="24" />
              <div className="flex-grow text-center">
                <p className="text-xs">{tripDescShortened}</p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
export default TripSummaryMain;
