import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RiUserReceivedLine, RiUserSharedLine } from "react-icons/ri";
import ReceivedRequests from "../components/Application/ReceivedRequests";
import SentRequests from "../components/Application/SentRequests";

export default function ApplicantList() {
  const { isLogin } = useSelector((state) => state.auth);
  // 받은 요청 목록인지, 보낸 요청 목록인지 확인
  const [selectedOption, setSelectedOption] = useState("sent");
  const { concept, conceptColor } = useSelector((state) => state.concept);


  // 누른 옵션에 따라 selectedOption 값 설정
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => { }, [selectedOption]);

  return (
    <Fragment>
      <div>
        {isLogin ? (
          <div className="flex flex-row p-6 justify-evenly">
            <div
              className={`flex flex-row rounded-3xl p-3 hover:font-semibold hover:bg-amber-300 hover:bg-opacity-70 ${selectedOption === "sent"
                  ? " bg-amber-300 bg-opacity-70  font-semibold transition ease-in-out scale-105 duration-200"
                  : " bg-stone-300 "
                }`}
              onClick={() => handleOptionChange("sent")}
            >
              <RiUserSharedLine className="mx-3 " size="24" />
              <button className="text-sm">보낸 요청 목록</button>
            </div>
            <div
              className={`flex flex-row rounded-3xl p-3 hover:font-semibold hover:bg-amber-300 hover:bg-opacity-70 ${selectedOption === "received"
                  ? " bg-amber-300 bg-opacity-70  font-semibold transition ease-in-out scale-105 duration-200"
                  : " bg-stone-300 "
                }`}
              onClick={() => handleOptionChange("received")}
            >
              <RiUserReceivedLine className="mx-3 " size="24" />
              <button className="text-sm">받은 요청 목록</button>
            </div>
          </div>
        ) : (
          <div className="flex items-start w-full h-full">
            <div className={`mx-auto mt-24 text-xl font-bold text-center animate-bounce text-${conceptColor}-400`}>
              로그인을 해주세요
            </div>
          </div>
        )}

        {isLogin &&
          (selectedOption !== "received" ? (
            <SentRequests />
          ) : (
            <ReceivedRequests />
          ))}
      </div>
    </Fragment>
  );
}
