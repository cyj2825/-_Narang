import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { ModalPortal } from "../modals/ModalPortal";
import MileageModal from "../modals/MileageModal";

const Mileage = (props) => {
  // 마일리지 모달 오픈 동작
  const [isOpen, setIsOpen] = useState(false);
  // 마일리지 잔액 조회
  const [balance, setBalance] = useState(0);
  const userId = useSelector((state) => state.auth.userId);

  const OpenMileage = () => {
    setIsOpen(true);
  };

  const CloseMileage = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // 잔액 조회
  const handleBalance = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PAYMENT_REQUEST_URI}/balance?user_id=${userId}`
      );

      setBalance(response.data);
    } catch (error) {
      console.error("에러 발생", error);
    }
  };

  useEffect(() => {
    handleBalance();
  }, [userId]);

  return (
    <div className="flex justify-between p-3 my-3 border rounded-lg border-neutral-300 ">
      <div className="m-1 text-sm">💰 보유마일리지 : {balance} 원</div>
      <button
        className="p-1 mr-2 text-xs border rounded-md border-neutral-200"
        onClick={OpenMileage}
      >
        충전하기
      </button>
      {isOpen && (
        <ModalPortal>
          <MileageModal onClose={CloseMileage} />
        </ModalPortal>
      )}
    </div>
  );
};

export default Mileage;
