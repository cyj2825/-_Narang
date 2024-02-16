import { Fragment, useState, useEffect } from "react";
import { SlCalender, SlLocationPin } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import DateFormatter from "../../DateFormatter";


const TripSummary = ({ trip }) => {
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/detail/${trip.tripId}`);
  };

  useEffect(() => {
    setDepartureDate(DateFormatter({ dateString: trip.departureDate }));
    setReturnDate(DateFormatter({ dateString: trip.returnDate }));
  }, [trip.departureDate, trip.returnDate]);

  return (
    <Fragment>
      <div>
        <button
          onClick={handleViewClick}
          className="flex w-[40rem] px-5 py-4 mx-1 my-4 transition border rounded-md itmes-center bg-neutral-100 border-neutral-200 hover:bg-neutral-200 hover: hover:ease-in-out hover:duration-200"
        >
          <div className="flex items-center">
            <div className="flex flex-row items-center my-1.5 mr-2 text-sm">
              <p className="text-xs">
               {trip.tripName}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src={trip.tripImgUrl}
                alt="tripThumbnail"
                className="w-10 h-10 mx-3 mb-2 transition-transform duration-300 ease-in-out transform scale-100 rounded-full"
              />
            </div>
            <div className="flex flex-row items-center my-1.5 text-sm">
              <SlCalender className="mx-2 " size="20" />
              <p className="text-xs">
                {departureDate} ~ {returnDate}
              </p>
            </div>
            <div className="flex flex-row items-center my-1.5 text-sm">
              <SlLocationPin className="mx-2 " size="20" />
              <p className="text-xs">
                {trip.continent}, {trip.country}, {trip.city}
              </p>
            </div>
            </div>
        </button>
      </div>
    </Fragment>
  );
};
export default TripSummary;
