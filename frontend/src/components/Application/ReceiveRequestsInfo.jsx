import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const ReceiveRequestsInfo = ({ data, trip, updateReceivedData }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const userId = useSelector((state) => state.auth.userId);
  const [userData, setUserData] = useState([]);
  // 날짜 포맷
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const fetchUserData = async () => {
    try {
      // API에서 데이터 가져오는 요청
      const response = await axios.get(
        `${import.meta.env.VITE_USER_REQUEST_URI}/profile/${data.senderId}`
      );
      // 가져온 데이터를 state에 업데이트
      setUserData(response.data);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };
  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip/join`,
        {
          tripId: trip.tripId,
          userId: data.senderId,
          alertId: data.id,
          userRoles: data.position,
          usageId: data.usageId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 성공한 경우 상태를 업데이트하여 렌더링을 다시 실행
      setIsAccepted(true);
      setIsRejected(false);
      await updateReceivedData();
    } catch (error) {
      // 오류 처리
      console.error("서버 응답 에러", error);
    }
  };
  const handleReject = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip/reject`,
        {
          tripId: data.tripId,
          userId: data.senderId,
          usageId: data.usageId,
          alertId: data.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 성공한 경우 상태를 업데이트하여 렌더링을 다시 실행
      setIsAccepted(false);
      setIsRejected(true);
      await updateReceivedData();
    } catch (error) {
      // 오류 처리
      console.error("서버 응답 에러", error);
    }
  };
  // useEffect를 사용하여 데이터가 갱신될 때마다 수락, 거절 상태 초기화
  useEffect(() => {
    fetchUserData();
    setIsAccepted(false);
    setIsRejected(false);
  }, [data]);
  return (
    <Fragment>
      <div className="flex flex-wrap justify-center w-full">
        <div className="flex flex-row justify-around w-9/12 m-2">
          <div className="grid h-24 grid-rows-2 p-2 border rounded-lg w-/12 border-stone-400">
            <div className="flex items-center justify-between mx-4 mb-2">
              <div>
                <img
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                  src={userData.profile_url}
                  alt="프로필사진"
                />
                <span className="mx-3 text-sm">{data.senderName}</span>
              </div>
              <div className=" p-1.5 text-sm text-center flex ">
                {data.position &&
                  data.position.map((role, idx) => (
                    <span
                      className="p-1 border bg-neutral-100 rounded-xl border-neutral-100"
                      key={idx}
                    >
                      {role}{" "}
                    </span>
                  ))}
              </div>
            </div>
            <div className="p-2 mx-5 text-sm border rounded-xl border-slate-300">
              <p>{data.aspiration}</p>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="items-center px-6 py-3 mx-2 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-inset ring-green-600/20"
              onClick={handleAccept}
            >
              수락
            </button>
            <button
              className="items-center px-6 py-3 mx-2 text-xs font-medium text-red-700 rounded-md bg-red-50 ring-1 ring-inset ring-red-600/10"
              onClick={handleReject}
            >
              거절
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ReceiveRequestsInfo;
