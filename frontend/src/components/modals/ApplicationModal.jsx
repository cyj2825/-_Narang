import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

import { ModalPortal } from "./ModalPortal";
import SuccessModal from "./SuccessModal";

const ApplicationModal = ({ data, onClose }) => {
  // 지원한 포지션리스트 저장
  const [selectedPositions, setSelectedPositions] = useState([]);
  // 포부
  const [comment, setComment] = useState("");
  // 신청 완료 여부
  const [isApplicationSuccess, setIsApplicationSuccess] = useState(false);
  // 보유 마일리지
  const [balance, setBalance] = useState(0);
  // 충전 금액
  const [price, setPrice] = useState(0);

  const userId = useSelector((state) => state.auth.userId);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleChangeComment = (e) => {
    setComment(e.target.value);
  };

  // 포지션 체크박스 선택하는 값 갱신
  const handleCheckboxChange = (position) => {
    setSelectedPositions((prevPositions) =>
      prevPositions.includes(position)
        ? prevPositions.filter((pos) => pos !== position)
        : [...prevPositions, position]
    );
  };

  // 잔액 조회
  const handleBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PAYMENT_REQUEST_URI}/balance?user_id=${
          postData.senderId
        }`
      );

      setBalance(response.data);
    } catch (error) {
      console.error("에러 발생", error);
    }
  };

  // 신청자, 즉 로그인 한 사람 정보 조회
  const [userData, setUserData] = useState([]);
  const fetchUserData = async () => {
    try {
      // API에서 데이터 가져오는 요청
      const response = await axios.get(
        `${import.meta.env.VITE_USER_REQUEST_URI}/profile/${postData.senderId}`
      );

      // 가져온 데이터를 state에 업데이트
      setUserData(response.data);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    handleBalance();
    fetchUserData();
  }, []);

  // 보유 마일리지와 예약 마일리지의 차이 계산
  // 0 이상이면 신청 가능, 0 이하이면 충전해야함
  const mileageDifference = balance - data.tripDeposit;

  const postData = {
    tripId: data.tripId,
    tripName: data.tripName,
    senderId: userId,
    receiverId: data.tripLeaderId,
    position: window.btoa(
      encodeURIComponent(JSON.stringify(selectedPositions))
    ),
    aspiration: comment,
    alertType: "REQUEST",
    read: false,
  };

  // 신청하기 버튼 눌렀을 때
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ALERT_REQUEST_URI}/attend`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 신청 성공 여부 true
        setIsApplicationSuccess(true);
      } else {
        // 에러 응답에 대한 처리
        console.error("신청하기 실패");
      }
    } catch (error) {
      // 네트워크 또는 기타 오류에 대한 처리
      console.error("에러 발생", error);
    }
  };

  const handleCharge = async () => {
    setIsRedirecting(true);

    try {
      const url = `${import.meta.env.VITE_REQUEST_API}/detail/${
        postData.tripId
      }`;

      const response = await axios.post(
        `${import.meta.env.VITE_PAYMENT_REQUEST_URI}/ready?user_id=${
          postData.senderId
        }&price=${price}&return_url=${url}`
      );

      // 서버 응답에서 리다이렉션 URL을 가져옴
      const redirectUrl = response.data.next_redirect_pc_url;

      // 리다이렉션 수행
      window.location.href = redirectUrl;
      handleBalance();
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  const modalBG = useRef("");

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-opacity-60 bg-neutral-300"
      onClick={onClose}
      ref={modalBG}
    >
      <div
        className="z-40 px-10 py-8 bg-white w-[28rem] h-[40rem] rounded-3xl "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="font-spoqa">
          <div className="flex justify-end mr-1">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          </div>
          {isApplicationSuccess ? (
            <ModalPortal>
              <SuccessModal onClose={onClose} />
            </ModalPortal>
          ) : (
            <div>
              <div className="inline-block mb-4 ml-4 align-middle">
                <img
                  className="inline-block w-12 h-12 rounded-full ring-2 ring-white"
                  src={userData.profile_url}
                  alt="프로필이미지"
                />
                <span className="mx-5 text-base font-semibold">
                  {userData.nickname}
                </span>
              </div>
              <div className="mx-4">
                <span className="text-base font-semibold">🧩 포지션 선택</span>

                <div className="p-3 my-3  overflow-auto border border-stone-600 rounded-xl h-[10rem]">
                  <div>
                    {data.tripRoles &&
                      data.tripRoles.map((position, index) => (
                        <div key={index} className="flex justify-between">
                          <label className="m-2 text-sm">{position}</label>
                          <input
                            type="checkbox"
                            value={position}
                            onChange={() => handleCheckboxChange(position)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="mx-4 my-4">
                <span className="text-base font-semibold">
                  🧨 같이 여행 가고싶어요!
                </span>
                <div className="p-3 my-3 border border-stone-600 rounded-xl">
                  <textarea
                    value={comment}
                    onChange={handleChangeComment}
                    required
                    className=" outline-none w-full text-xs resize-none h-[4rem] p-1.5"
                  />
                </div>
              </div>
              <div className="mx-4 my-4">
                💥 예약 마일리지 : {data.tripDeposit}
              </div>
              <div className="mx-4 my-4">
                <span
                  className={`${
                    mileageDifference < 0 ? "text-red-500" : "text-black"
                  }`}
                >
                  💰 보유 마일리지 : {balance}
                </span>
              </div>
              <div className="flex justify-end">
                {mileageDifference >= 0 ? (
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-700 rounded-md bg-blue-50 ring-1 ring-inset ring-blue-700/10"
                  >
                    신청하기
                  </button>
                ) : (
                  <div>
                    <input
                      type="number"
                      placeholder="숫자만 입력해주세요"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-24 p-1 mx-2 border rounded-md border-neutral-400"
                    />
                    <button
                      onClick={handleCharge}
                      className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-700 rounded-md bg-blue-50 ring-1 ring-inset ring-blue-700/10"
                    >
                      충전하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
