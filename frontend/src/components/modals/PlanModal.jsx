import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";
import axios from "axios";

const PlanModal = ({ onClose, onSelectedPlanId, onSelectedPlanName }) => {
  const modalBG = useRef("");
  const [planList, setPlanList] = useState([]);
  const userId = useSelector((state) => state.auth.userId);

  const fetchPlanList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PLAN_REQUEST_URI}/my/${userId}`
      );
      setPlanList(response.data);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchPlanList();
  }, []);

  const handlePlanSelect = ({ planId, planName }) => {
    onSelectedPlanId(planId);
    onSelectedPlanName(planName);
    onClose();
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-8 bg-white w-[28rem] h-[40rem] rounded-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className=" font-spoqa">
          <div className="flex justify-end">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          </div>
          <p className="mt-3 mb-10 text-lg font-bold text-center">
            계획📑을 선택해주세요!
          </p>
          <div className="w-full mb-4 align-middle">
            <table className="w-full text-center border-collapse rounded-md">
              <thead className="bg-neutral-100">
                <tr>
                  <th className="p-2" >계획 이름</th>
                  <th className="p-2">계획 설명</th>
                  <th></th>
                </tr>
              </thead>
              <tbody >
                {planList.map((item, index) => (
                  <tr key={index} className="border border-b">
                    <td className="p-2 ">
                      {item.planName}
                    </td>
                    <td className="p-2 ">
                      {item.planDesc}
                    </td>
                    <td>
                      <button
                        className="p-1 text-base rounded-xl hover:bg-amber-200"
                        onClick={() =>
                          handlePlanSelect({
                            planId: item.planId,
                            planName: item.planName,
                          })
                        }
                      >
                        선택
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
