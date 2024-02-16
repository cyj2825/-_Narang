### 구글 맵 키 발급후, @react-google-maps/api 설치

---

- `.env` 파일에 API_KEY 설정

`VITE_APP_GOOGLEMAP_API_KEY={발급받은 키 입력}`

- 라이브러리 설치

`npm install @react-google-maps/api`

### 기본 지도 띄우기 : GoogleMap.jsx

---

- `React.memo`를 이용하여 변경시에만 작동하도록 설정
- `containerStyle` : 지도 컨테이너 크기
- `center` : 지도 로드 시 처음으로 띄울 지역의 위도, 경도 지정
- `zoom` : **확대/축소 수준(1:세계, 5:대륙, 10:도시, 15:거리, 20:건물)**

```jsx
import React, { Fragment } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "1200px",
  height: "650px",
};

const center = {
  lat: 37.5012647456244,
  lng: 127.03958123605,
};

const options = {
  minZoom: 4,
  maxZoom: 18,
};

function MyComponent() {
  // 지도를 불러오는 함수
  // useJsApiLoader 함수는 isLoaded, loadError를 return
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // google maps 에서 받은 api key를 전달
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAP_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  // 지도를 그릴때 동작하는 함수
  // google map의 instance를 사용가능
  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  // 지도 컴포넌트가 언마운트 되기 전에 해야하는 동작
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <Fragment>
      <h1>Google Map</h1>
      <hr />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      ></GoogleMap>
    </Fragment>
  ) : null;
}

export default React.memo(MyComponent);
```

### 지도 커스텀하기

---

- 기본 UI 지우기

`options = disableDefaultUI: true`

- 기본 마커 지우기

```jsx
const myStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];
```

`options = style: myStyles`

- 마커 추가하기

```jsx
<MarkerF position={center} />

// 👉 position (필수옵션!) = 마커의 위치
// 👉 custom Marker사용시 마커 추가 선택옵션
// map = 마커를 배치할 Map을 지정   ex) map={myMap1}
//       마커의 setMap() 메서드를 호출하여 마커 추가 및 삭제 가능.
// title = 마커의 설명   ex) title:"Hello World!"
// icon, path, scale, anchor, rotaion, fillColor 등등..
```

- 다중 마커 띄우기(더미데이터)

```jsx
const [locations, setLocations] = useState([
  { name: "명동", lat: 37.563576, lng: 126.983431 },
  { name: "가로수길", lat: 37.5203, lng: 127.023008 },
  { name: "광화문", lat: 37.575268, lng: 126.976896 },
  { name: "남산", lat: 37.550925, lng: 126.990945 },
  { name: "이태원", lat: 37.540223, lng: 126.994005 },
]);

<GoogleMap>
  ...
  {locations.map((location, index) => (
    <MarkerF
      key={index}
      label={String(index + 1)}
      position={{ lat: location.lat, lng: location.lng }}
    />
  ))}
  ...
</GoogleMap>;
```

### 장소 검색 기능 추가

---

```jsx
import React, { useCallback, useRef, useEffect, useState } from "react";

const SearchBox = ({ map, onPlaceSelected }) => {
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

      setSelectedPlaces((prevPlaces) => [...prevPlaces, { lat, lng }]);
      onPlaceSelected({ lat, lng });
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

  return <input ref={input} placeholder="장소를 검색해주세요" type="text" />;
};

export default SearchBox;
```

### 검색한 장소 새로운 배열에 저장, 새로운 마커 추가

---

```jsx
const handlePlaceSelected = useCallback((place) => {
    const newMarkers = [...markers, { position: place, label: String(markers.length + 1) }];
    setMarkers(newMarkers);

  }, [markers]);

<SearchBox map={map} onPlaceSelected={handlePlaceSelected} />
<GoogleMap>
...
{markers.map((marker, index) => (
          <MarkerF
            key={index}
            label={marker.label}
            position={marker.position}
          />
 ))}
<GoogleMap />
```

### center과의 거리에 따라 마커들을 정렬

---

```jsx
// 두 장소간의 거리 계산
// Haversine 공식 -> 지구 표면에서의 두 지점 간 직선거리 계산
const calculateDistance = (p1, p2) => {
  const R = 6378137; // 지구의 평균 반지름 (미터)
  const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
  const dLong = (p2.lng - p1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // 거리를 미터 단위로 반환
};

console.log("Sorted Markers:", sortedMarkers);

// 거리를 계산한 마커들을 정렬해서 저장
const sortedMarkers = markers
  .map((marker) => ({
    ...marker,
    distance: calculateDistance(center, marker.position),
  }))
  .sort((a, b) => a.distance - b.distance);
```

### Directions API 경로, 거리, 시간

---

```jsx
import React, { useState, useEffect, useRef, Fragment } from "react";
import { DirectionsRenderer, DirectionsService } from "@react-google-maps/api";

const Directions = ({ origin, destination }) => {
  const [directions, setDirections] = useState();
  const count = useRef(0);

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
    // console.log(origin, destination);
  }, [origin, destination]);

  const directionsCallback = (result, status) => {
    // console.log(result, status);
    // 동일한 방향에 대해 여러 번의 콜백이 발생하는 경우에도 첫 번째 호출만 고려
    if (status === "OK" && count.current === 0) {
      console.log("출발 : " + result.routes[0].legs[0].start_address);
      console.log("도착 : " + result.routes[0].legs[0].end_address);
      console.log("거리 : " + result.routes[0].legs[0].duration.text);
      console.log("시간 : " + result.routes[0].legs[0].distance.text);
      count.current += 1;
      setDirections(result);
    }
  };

  useEffect(() => {
    // console.log("Directions updated:", setDirections);
  }, [setDirections]);

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
```

```jsx
{markers.length >= 2 && (
          <Fragment>
            {sortedMarkers.slice(0, -1).map((marker, index) => (
              <Directions
                key={index}
                origin={sortedMarkers[index].position}
                destination={sortedMarkers[index + 1].position}
              />
             ))}
         </Fragment>
)}

-> 마커가 2개 이상되면, 경로를 표시하도록!
```

### 🧨 중간 결과

---

**용산공원 → 신용산역 → 남산공원 → 여의도한강공원 경로**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/70eaefed-cba3-4940-b1f6-c69836d0889f/e19879bf-349f-44a6-8a54-ab39ec146fe0/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/70eaefed-cba3-4940-b1f6-c69836d0889f/b0644e74-9510-410f-98b2-d2630ea44c7a/Untitled.png)

### 추가 고려사항

---

```jsx
1. 지금은 지도 처음 띄울 때 설정하는 center를 기준으로 거리를 계산해서 마커를 찍는데 추후에 가능하다면
	최적경로까진 못하더라도 출발지 고정해서 출발지에서 가까운 장소부터 가는 경로를 ? 뭐가 좋을지 고민!
2. 한국은 DRIVING 옵션이 적용 안되는 것 같고, 해외로 바꿔서 DRIVING, TRANSIT 선택 가능한 지 확인
3. Directions.jsx에서 console에 출력한 거리, 시간을 상태관리 이용해서 화면에 출력 ? DB 저장 ?
4. Directions API에서 제공하는 기본 아이콘, 설명 등 커스텀 가능한 옵션
```

### 장소 검색 및 세부 정보

---

**getDetails()호출이 성공하면 반환되는 속성**

```
//장소를 고유하게 나타내는 텍스트 식별자
place_id -> 장소 세부정보 요청에 전달에서 정보 가져올 수 있음

// 장소의 이름
name

// 장소가 비즈니스인 경우 장소의 영업상태를 나타냄
business_status : OPERATIONAL,  CLOSED_TEMPORARILY ,  CLOSED_PERMANENTLY

// 장소의 사람이 읽을 수 있는 주소 (대개 우편 주소와 일치)
formatted_address

// 장소의 도형 관련 정보
geometry : location(위도, 경도 제공)

// 이 장소의 유형을 나타내는데 사용할 수 있는 이미지 리소스의 URL
icon

// 장소의 영업 기간
opening_hours -> periods[] : 일요일부터 7일 동안의 영업기간을 시간순으로 나타내는 배열
              -> weekday_text : 각 요일의 형식이 지정된 영업시간을 나타내는 일곱 개의 문자열 배열

// 집계된 사용자 리뷰를  기준으로 한 장소 평점(0.0~5.0)
rating

// PlacePhtoh 객체의 배열 getUrl()메서드로 사진 가져올 수 있음
photos[] -> height(최대 높이), width(최대 너비) 지정 가능
```
