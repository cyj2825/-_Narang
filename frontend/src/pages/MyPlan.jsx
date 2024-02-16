import axios from "axios";
import { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";

import { ModalPortal } from "../components/modals/ModalPortal";
import NewPlan from "../components/modals/NewPlan";
import PlanSummary from "../components/Planning/PlanSummary";
import { scheduleActions } from "../store/scheduleSlice";
import { placesActions } from "../store/placeSlice";

const MyPlan = () => {
  const [planData, setPlanData] = useState([]);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const { isLogin, userId } = useSelector((state) => state.auth);
  const { conceptColor } = useSelector((state) => state.concept);
  const dispatch = useDispatch();

  dispatch(scheduleActions.reset());
  dispatch(placesActions.reset());

  const getUsersPlan = async () => {
    if (userId !== "") {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PLAN_REQUEST_URI}/my/${userId}`
        );
        setPlanData(response.data);
      } catch (error) {
        console.error("Error : ", error);
      }
    }
  };

  useEffect(() => {
    getUsersPlan();
  }, [userId]);

  // 계획 만들기 모달
  const makePlan = () => {
    setIsNewPlanOpen(true);
  };
  const CloseNewPlanModal = () => {
    setIsNewPlanOpen(false);
  };

  useEffect(() => {
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isNewPlanOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isNewPlanOpen]);

  return (
    <Fragment>
      {!isLogin ? (
        <div className="flex items-start w-full h-full">
          <div
            className={`mx-auto mt-24 text-xl font-bold text-center animate-bounce text-${conceptColor}-400`}
          >
            로그인을 해주세요
          </div>
        </div>
      ) : (
        <div className="relative">
          <p className="my-2 text-2xl font-bold text-center">나의 계획</p>
          <button
            className="absolute top-0 right-0 px-2 py-3 mr-2 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-md ring-1 ring-inset ring-yellow-800/10"
            onClick={makePlan}
          >
            계획 만들기
          </button>
          {planData.length === 0 ? (
            <>
              <p className="pt-6 my-2 text-xl font-bold text-center">
                작성한 계획이 없어요
              </p>
            </>
          ) : (
            <div className="flex flex-wrap justify-start gap-4">
              {planData.map((plan, idx) => (
                <PlanSummary plan={plan} key={idx} />
              ))}
            </div>
          )}
          {isNewPlanOpen && (
            <ModalPortal>
              <NewPlan onClose={CloseNewPlanModal} />
            </ModalPortal>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default MyPlan;
