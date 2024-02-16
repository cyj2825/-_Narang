import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { ModalPortal } from "../modals/ModalPortal";
import AddInfoModal from "../modals/AddInfoModal";
import LeaveUserModal from "../modals/LeaveUserModal";

const UserInfo = () => {
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);

  const userId = useSelector((state) => state.auth.userId);
  const [userData, setUserData] = useState([]);

  const Openmodify = () => {
    setIsModifyOpen(true);
  };

  const Closemodify = () => {
    setIsModifyOpen(false);
  };

  const OpenExit = () => {
    setIsExitOpen(true);
  };

  const CloseExit = () => {
    setIsExitOpen(false);
  };

  const fetchUserData = async () => {
    try {
      // API에서 데이터 가져오는 요청
      const response = await axios.get(
        `${import.meta.env.VITE_USER_REQUEST_URI}/profile/${userId}`
      );

      // 가져온 데이터를 state에 업데이트
      setUserData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    console.log(userId);
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isModifyOpen || isExitOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 유저 데이터를 가져오는 함수 호출
    fetchUserData();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExitOpen, isModifyOpen, userId]);

  return (
    <div className="flex flex-col p-3 my-3 border rounded-lg border-neutral-300 ">
      <div className="flex justify-evenly">
        <img
          className="rounded-full w-14 h-14"
          alt="프로필 이미지"
          src={userData.profile_url}
        />
        <p className="flex items-center justify-center w-1/3 text-lg font-bold">
          {userData.nickname}
        </p>
        <button className="m-1 text-xs" onClick={Openmodify}>
          정보수정
        </button>
        <button className="text-xs" onClick={OpenExit}>
          회원탈퇴
        </button>
      </div>
      <div className="flex flex-col items-start ml-20">
        <div className="flex">
          <p className="m-1 text-sm">{userData.ageRange}대 </p>
          <p className="m-1 text-sm">
            {userData.gender === "male" ? "남성🧑🏻" : "여성👧🏻"}
          </p>
        </div>

        <p className="m-1 text-sm">
          {userData.userRoles &&
            userData.userRoles.map((role) => role.roleName).join(", ")}
        </p>
      </div>
      {isModifyOpen && (
        <ModalPortal>
          <AddInfoModal userId={userId} data={userData} onClose={Closemodify} />
        </ModalPortal>
      )}
      {isExitOpen && (
        <ModalPortal>
          <LeaveUserModal onClose={CloseExit} />
        </ModalPortal>
      )}
    </div>
  );
};

export default UserInfo;
