import ClipLoader from "react-spinners/ClipLoader";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import CarouselTemplete from "../ui/Carousel";

const LoadingDiv = () => {
  return <div className="flex flex-col items-center justify-center h-full">
    <ClipLoader />
  </div>
}

const NoDataMsg = ({ conceptColor }) => {
  return <div className="flex flex-col items-center justify-center h-full">
    <p className={`text-lg font-semibold animate-bounce text-${conceptColor}-400`}>모집글을 작성해 보세요</p>
  </div>
}
const TripListContent = () => {
  const { concept, conceptColor } = useSelector((state) => state.concept);
  const [isLoading, setIsLoading] = useState(false);
  const [conceptTripList, setConceptTripList] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source(); // 빠르게 컨셉 변경 시 호출 취소하기 위함

    const getConceptTrip = async (concept) => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_TRIP_REQUEST_URI}/trips/banner?tripConcept=${concept}`)
        setConceptTripList(res.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("axios 캔슬", error.message)
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getConceptTrip(concept);

    return () => {
      source.cancel("너무 빠른 api 요청으로 캔슬")
    }
  }, [concept])



  if (isLoading) {
    return <LoadingDiv />;
  } // 로딩중이면

  if (conceptTripList.length === 0) {
    return <NoDataMsg conceptColor={conceptColor} />;
  } //데이터 없으면

  return <CarouselTemplete list={conceptTripList} />;
  //둘다 아니면
}

const TripList = () => {
  return (
    <div className="w-full h-[43svh] m-auto">
      <TripListContent />
    </div>
  );
};
export default TripList
