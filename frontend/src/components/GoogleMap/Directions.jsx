import { useState, useEffect, useRef, Fragment } from "react";
import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { directionsActions } from "../../store/directionsSlice";

const Directions = ({ origin, destination, onDirectionsInfoUpdate }) => {
  const [directions, setDirections] = useState();
  const count = useRef(0);
  const dispatch = useDispatch();

  const dirOptions = {
    // 경로선 색, 두께, 투명도
    polylineOptions: {
      strokeColor: "red",
      strokeWeight: 6,
      strokeOpacity: 0.5,
    },
    // 기본마커 제거
    suppressMarkers: true,
  };

  useEffect(() => {
    count.current = 0;
  }, [origin, destination]);

  const directionsCallback = (result, status) => {
    // 동일한 방향에 대해 여러 번의 콜백이 발생하는 경우에도 첫 번째 호출만 고려
    if (status === "OK" && count.current === 0) {
      const { start_address, end_address, distance, duration } =
        result.routes[0].legs[0];

      const directionsInfo = {
        startAddress: start_address,
        endAddress: end_address,
        distance: distance.text,
        duration: duration.text,
      };

      // 배열에 추가하지 않고 부모 컴포넌트로 정보 전달
      onDirectionsInfoUpdate(directionsInfo);

      dispatch(directionsActions.addDirections({ directionsInfo }));
      count.current += 1;
      setDirections(result);
    }
  };

  useEffect(() => {}, [setDirections]);

  return (
    <Fragment>
      <DirectionsService
        options={{ origin, destination, travelMode: "TRANSIT" }}
        callback={directionsCallback}
      />
      <DirectionsRenderer directions={directions} options={dirOptions} />
    </Fragment>
  );
};

export default Directions;
