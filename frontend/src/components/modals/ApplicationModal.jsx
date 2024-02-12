import { useEffect, useRef, useState } from "react";
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
        `https://i10a701.p.ssafy.io/api/payment/balance?user_id=${postData.senderId}`
      );

      console.log(response);
      setBalance(response.data);
    } catch (error) {
      console.error("에러 발생", error);
    }
  };

  useEffect(() => {
    handleBalance();
  }, []);

  
  // 보유 마일리지와 예약 마일리지의 차이 계산
  // 0 이상이면 신청 가능, 0 이하이면 충전해야함
  const mileageDifference = 200 - data.tripDeposit;

  const postData = {
    tripId: data.tripId,
    tripName: data.tripName,
    senderId: "노세희",
    receiverId: data.tripLeaderId,
    position: selectedPositions,
    aspiration: comment,
    alertType: "REQUEST",
    read: false,
  };

  // 신청하기 버튼 눌렀을 때
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://i10a701.p.ssafy.io/api/message/alert/attend",
        postData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // 성공
        console.log("신청하기 성공");
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
    
    const user_id = "노세희"; // 사용자 ID
    const price = 20000; // 충전 금액

    try {
      const url = `http://localhost:3000/detail/${postData.tripId}`;
      
      const response = await axios.post(
        `https://i10a701.p.ssafy.io/api/payment/ready?user_id=${user_id}&price=${price}&return_url=${url}`
      );

      console.log(response.data.next_redirect_pc_url);
      // 서버 응답에서 리다이렉션 URL을 가져옴
      const redirectUrl = response.data.next_redirect_pc_url;

      // 리다이렉션 수행
      window.location.href = redirectUrl;
      handleBalance();

      console.log("서버 응답:", response.data);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };



  const modalBG = useRef("");

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-opacity-60 bg-neutral-300"
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
        <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          {isApplicationSuccess ? (
            <ModalPortal>
              <SuccessModal onClose={onClose} />
            </ModalPortal>
          ) : (
            <div>
              <div className="inline-block mb-4 align-middle">
                <img
                  className="inline-block w-12 h-12 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
                <span className="mx-3 text-ml">user_1</span>
              </div>
              <div className="mx-4">
                <span>포지션 선택</span>

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
                <span>한마디 작성!</span>
                <div className="p-3 my-3 border border-stone-600 rounded-xl">
                  <textarea
                    value={comment}
                    onChange={handleChangeComment}
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
