import { Fragment, useCallback, useEffect, useState, } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TripInfo from "./TripInfo";

const ReceivedRequests = () => {
  const [pageNo, setPageNo] = useState(0);
  const [tripData, setTripData] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const fetchRequestData = async (tripId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ALERT_REQUEST_URI}/trip/${tripId}`
      );
      return response.data.alertList.length > 0; 
    } catch (error) {
      console.error("Error fetching request data:", error);
      return false; 
    }
  };

  const getMyList = useCallback(async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/recruit`,
        {
          userId: userId,
          pageNo: pageNo,
        },
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

      const filteredTrips = [];
      for (const trip of response.data.content) {
        const hasAlerts = await fetchRequestData(trip.tripId);
        if (hasAlerts) {
          filteredTrips.push(trip);
        }
      }

      // 새로운 데이터를 기존 데이터에 추가
      setTripData((prevData) => [...prevData, ...filteredTrips]); // 가져온 데이터를 상태로 설정
      // 페이지 번호 증가
      setPageNo((prevPageNo) => prevPageNo + 1);
    } catch (error) {
      console.error("내가 작성한 목록 가져오는 중 에러 발생 : error");
    }
  }, [pageNo]);

  useEffect(() => {
    getMyList();
  }, [pageNo]);

  return (
    <Fragment>
      {tripData &&
        tripData.map((trip, idx) => {
          return <TripInfo tripData={trip} key={idx} />
        })}
    </Fragment>
  );
};

export default ReceivedRequests;
