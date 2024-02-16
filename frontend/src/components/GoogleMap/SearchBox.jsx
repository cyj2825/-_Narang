import { useCallback, useRef, useEffect, useState } from "react";

import "../../css/SearchBox.css";

const SearchBox = ({ map, onPlaceSelected, isCanModify }) => {
  const input = useRef(null);
  const searchBox = useRef(null);
  const [selectedPlaces, setSelectedPlaces] = useState([]);

  // 검색 상자에서 장소가 변경될 때 호출되는 함수
  // 선택된 장소의 좌표를 추출, 상태를 업데이트, onPlaceSelected 콜백을 호출
  const handleOnPlacesChanged = useCallback(() => {
    const places = searchBox.current.getPlaces();

    if (places.length > 0) {
      const selectedPlace = places[0];
      const lat = selectedPlace.geometry.location.lat();
      const lng = selectedPlace.geometry.location.lng();
      const placeId = selectedPlace.place_id;

      setSelectedPlaces((prevPlaces) => [...prevPlaces, { lat, lng, placeId }]);
      onPlaceSelected({ lat, lng, placeId });
    }
    if (input.current) {
      input.current.value = "";
    }
  }, [onPlaceSelected]);


  useEffect(() => {
    if (map) {
      searchBox.current = new window.google.maps.places.SearchBox(
        input.current
      );
      searchBox.current.addListener("places_changed", handleOnPlacesChanged);
    }

    return () => {
      if (map) {
        searchBox.current = null;
        window.google.maps.event.clearInstanceListeners(searchBox);
      }
    };
  }, [map, handleOnPlacesChanged]);

  return (
    <div className="flex flex-col justify-center my-2 itmes-center">
      <div className="flex flex-row justify-center">
        <input
          ref={input}
          placeholder="장소를 입력해주세요"
          type="text"
          disabled={!isCanModify}
          className="w-full p-2 text-sm border rounded-sm border-neutral-300"
        />
        {/* <button onClick={handleSearchButtonClick} className="p-1 rounded-md text-neutral-700 bg-neutral-50 ring-1 ring-inset ring-neutral-700/10 hover:bg-neutral-100">검색</button> */}
      </div>
    </div>
  );
};

export default SearchBox;
