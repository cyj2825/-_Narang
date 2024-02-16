import { Fragment, useState, useEffect } from "react";
import { SlLocationPin, SlPeople, SlInfo } from "react-icons/sl";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SentRequests() {
  const [sentData, setSentData] = useState(null);
  const [selectedType, setSelectedType] = useState("ALL");

  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  const fetchSentData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ALERT_REQUEST_URI}/list/send/${userId}`
      );
      const updatedSentData = await Promise.all(
        response.data.alertList.map(async (item) => {
          // 각 tripId에 대한 추가 정보를 가져오기
          const tripInfo = await fetchTripInfo(item.tripId);
          // 가져온 정보를 기존의 item과 합치기
          return { ...item, tripInfo };
        })
      );
      setSentData(updatedSentData);
    } catch (error) {
      console.error("요청 데이터를 불러오는 중 에러 발생:", error);
    }
  };

  const fetchTripInfo = async (tripId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip/${tripId}`
      );

      return response.data;
    } catch (error) {
      console.error("여행 정보를 불러오는 중 에러 발생:", error);
    }
  };
  const handleCancel = async (item) => {
    try {
      // 예약금 환불이 필요한 경우
      if (item.alertType === "ACCEPT") {
        try {
          await axios.patch(
            `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip/leave`,
            {
              tripId: item.tripId,
              userId: userId,
              usageId: item.usageId,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.error("Error refunding deposit:", error);
        }
      }
      if (item.alertType === "REQUEST") {
  
        try {
          await axios.post(
            `${import.meta.env.VITE_PAYMENT_REQUEST_URI}/reject?usage_id=${
              item.usageId
            }`
          );
        } catch (error) {
          console.error("Error refunding deposit:", error);
        }
      }
      // 취소에 대한 요청을 보내거나 삭제 로직
      await axios.delete(
        `${import.meta.env.VITE_ALERT_REQUEST_URI}/${item.id}`
      );
      // 삭제 요청이 성공하면 해당 알림을 새로고침 없이 제거
      setSentData((prevSentData) =>
        prevSentData.filter((i) => i.id !== item.id)
      );
    } catch (error) {
      console.error("에러 발생", error);
    }
  };
  // 요청중, 수락, 거절에 따라서 색깔 구분
  const getColorClass = (alertType) => {
    switch (alertType) {
      case "REQUEST":
        return "text-blue-500";
      case "ACCEPT":
        return "text-green-500";
      case "REJECT":
        return "text-red-500";
      default:
        return "";
    }
  };
  useEffect(() => {
    fetchSentData();
  }, []);

  const shortenDescription = (description) => {
    return description.length > 18
      ? description.slice(0, 17) + "..."
      : description;
  };

  const tripDetailHandler = (tripId) => {
    navigate(`/detail/${tripId}`);
  };

  return (
    <Fragment>
      <div className="flex justify-center">
        <div className="w-10/12 h-full text-center">
          <div>
            <div className="flex justify-around mb-4">
              <button
                className={`p-3 text-sm rounded-full ${
                  selectedType === "ALL"
                    ? "text-neutral-700 font-extrabold transition ease-in-out scale-110 duration-200"
                    : "font-medium"
                }`}
                onClick={() => setSelectedType("ALL")}
              >
                ALL
              </button>
              <button
                className={`p-3 text-sm rounded-full ${
                  selectedType === "REQUEST"
                    ? "text-blue-700 font-extrabold transition ease-in-out scale-110 duration-200"
                    : "font-medium"
                }`}
                onClick={() =>
                  setSelectedType((prev) =>
                    prev === "REQUEST" ? "ALL" : "REQUEST"
                  )
                }
              >
                REQUEST
              </button>
              <button
                className={`p-3 text-sm rounded-full ${
                  selectedType === "ACCEPT"
                    ? "text-green-700 font-extrabold transition ease-in-out scale-110 duration-200"
                    : "font-medium"
                }`}
                onClick={() =>
                  setSelectedType((prev) =>
                    prev === "ACCEPT" ? "ALL" : "ACCEPT"
                  )
                }
              >
                ACCEPT
              </button>
              <button
                className={`p-3 text-sm rounded-full ${
                  selectedType === "REJECT"
                    ? "text-red-700 font-extrabold transition ease-in-out scale-110 duration-200"
                    : "font-medium"
                }`}
                onClick={() =>
                  setSelectedType((prev) =>
                    prev === "REJECT" ? "ALL" : "REJECT"
                  )
                }
              >
                REJECT
              </button>
            </div>
            {sentData && sentData.length > 0 ? (
              sentData.map((item, idx) => {
                return (
                  (selectedType === "ALL" ||
                    item.alertType === selectedType) && (
                    <div className="flex justify-between" key={idx}>
                      <div
                        className={`w-4/5 m-4 border border-neutral-400 rounded-lg p-2`}
                      >
                        <div className="grid grid-cols-5">
                          <div className="col-span-1 m-2">
                            <img
                              src={item.tripInfo && item.tripInfo.tripImgUrl}
                              className="w-20 h-20 rounded-2xl"
                            />
                          </div>
                          <div className="col-span-3">
                            <button
                              onClick={() =>
                                tripDetailHandler(item.tripInfo.tripId)
                              }
                              className="mb-1 text-sm font-semibold"
                            >
                              {item.tripInfo.tripName}
                            </button>
                            <div className="ml-1 text-start">
                              <div className="flex items-center">
                                <SlLocationPin className="mr-3" size="14" />
                                <p className="text-sm">
                                  {item.tripInfo.continent},{" "}
                                  {item.tripInfo.country}, {item.tripInfo.city}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <SlPeople className="mr-3" size="14" />
                                <p className="text-sm">
                                  {item && item.tripInfo.participants.length} /{" "}
                                  {item.tripInfo.tripParticipantsSize}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <SlInfo className="mr-3" size="14" />
                                <p className="text-sm">
                                  {item.tripInfo.tripDesc.length > 18
                                    ? shortenDescription(item.tripInfo.tripDesc)
                                    : item.tripInfo.tripDesc}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center col-span-1">
                            <p className={`${getColorClass(item.alertType)}`}>
                              {item.alertType === "REQUEST"
                                ? "요청중"
                                : item.alertType === "ACCEPT"
                                ? "승인완료"
                                : "거절"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => handleCancel(item)}>취소</button>
                    </div>
                  )
                );
              })
            ) : (
              <div>아직 신청한 동행이 없습니다 !!</div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
