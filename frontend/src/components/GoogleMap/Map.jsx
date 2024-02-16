
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import SearchBox from "./SearchBox";
import Directions from "./Directions";
import Markers from "./Markers";
import PlaceCard from "./PlaceCard";
import { useDispatch } from "react-redux";
import { placesActions } from "../../store/placeSlice";
const Map = ({ isCanModify }) => {
  const containerStyle = {
    width: "224px",
    height: "250px",
  };
  const center = {
    lat: 37.5012647456244,
    lng: 127.03958123605,
  };
  const options = {
    mimZoom: 4,
    maxZoom: 18,
  };
  const myStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ];
  const dispatch = useDispatch();
  const [map, setMap] = useState("");
  const [markers, setMarkers] = useState([]);
  const [sortedPath, setSortedPath] = useState([]);
  const [sortedMarkers, setSortedMarkers] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLEMAP_API_KEY,
    libraries: ["places"],
  });
  const onLoad = useCallback(
    function callback(map) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
    },
    [center]
  );
  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);
  // 거리 계산
  const calculateDistance = (p1, p2) => {
    const R = 6378137;
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
    return d;
  };
  // 최근접 이웃 알고리즘
  const nearestNeighbor = (markers) => {
    const n = markers.length;
    const visited = Array(n).fill(false);
    const path = [];
    let current = 0;
    path.push(current);
    visited[current] = true;
    for (let i = 0; i < n - 1; i++) {
      let nearestNeighbor = -1;
      let minDistance = Number.MAX_SAFE_INTEGER;
      for (let j = 0; j < n; j++) {
        if (
          !visited[j] &&
          calculateDistance(markers[current].position, markers[j].position) <
            minDistance
        ) {
          nearestNeighbor = j;
          minDistance = calculateDistance(
            markers[current].position,
            markers[j].position
          );
        }
      }
      if (nearestNeighbor !== -1) {
        path.push(nearestNeighbor);
        visited[nearestNeighbor] = true;
        current = nearestNeighbor;
      }
    }
    return path;
  };
  const handlePlaceSelected = useCallback(
    (place) => {
      const newMarkers = [
        ...markers,
        {
          position: place,
          label: String(markers.length + 1),
          placeId: place.placeId,
        },
      ];
      setMarkers(newMarkers);
      // Places API로 세부 정보 요청
      const placesService = new window.google.maps.places.PlacesService(map);
      const request = {
        placeId: place.placeId,
        fields: [
          "name",
          "photos",
          "business_status",
          "formatted_address",
          "geometry",
          "icon",
          "rating",
          "opening_hours",
          "url",
        ],
      };
      const placeResult = {
        name: "",
        photo: "",
        businessStatus: "",
        formattedAddress: "",
        icon: "",
        rating: "",
        weekdayText: [],
        url: "",
        loca: [],
      };
      placesService.getDetails(request, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          placeResult.name = result.name;
          placeResult.photo =
            result.photos && result.photos.length > 0
              ? result.photos[1].getUrl({ maxHeight: 200, maxWidth: 200 })
              : null;
          placeResult.businessStatus = result.business_status;
          placeResult.formattedAddress = result.formatted_address;
          placeResult.icon = result.icon;
          placeResult.rating = result.rating;
          placeResult.icon = result.icon;
          placeResult.url = result.url;
          // placeResult.loca = result.geometry.location;
          placeResult.loca = [
            result.geometry.location.lat(),
            result.geometry.location.lng(),
          ];
          if (result.opening_hours && result.opening_hours.weekday_text) {
            placeResult.weekdayText = result.opening_hours.weekday_text;
          }
        } else {
          console.error("Error fetching place details:", status);
        }
        dispatch(placesActions.setSearchResults(placeResult));
      });
    },
    [markers, map]
  );
  useEffect(() => {
    if (markers.length >= 2) {
      const path = nearestNeighbor(markers);
      setSortedPath(path);
      setSortedMarkers(sortedPath.map((index) => markers[index]));
    }
  }, [markers]);
  useEffect(() => {
    if (sortedPath.length > 0) {
      setSortedMarkers(sortedPath.map((index) => markers[index]));
    }
  }, [sortedPath, markers]);
  const [directionsInfoArr, setDirectionsInfoArr] = useState([]);
  const handleDirectionsInfoUpdate = (directionsInfo) => {
    setDirectionsInfoArr((prevArr) => [...prevArr, directionsInfo]);
  };
  return isLoaded ? (
    <div className="flex-col w-1/4 h-full pt-10">
      <SearchBox
        map={map}
        onPlaceSelected={handlePlaceSelected}
        isCanModify={isCanModify}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          libraries: "places",
          styles: myStyles,
          disableDefaultUI: true,
          options,
        }}
      >
        <Markers markers={sortedMarkers} />
        {sortedMarkers.length >= 2 && (
          <>
            {sortedMarkers.slice(0, -1).map((marker, index) => (
              <Directions
                key={index}
                origin={sortedMarkers[index].position}
                destination={sortedMarkers[index + 1].position}
                placeId={marker.placeId}
                onDirectionsInfoUpdate={handleDirectionsInfoUpdate}
              />
            ))}
          </>
        )}
      </GoogleMap>
      <PlaceCard />
    </div>
  ) : null;
};
export default React.memo(Map);