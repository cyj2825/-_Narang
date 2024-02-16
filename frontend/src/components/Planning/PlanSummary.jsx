import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { scheduleActions } from "../../store/scheduleSlice";

const PlanSummary = ({ plan }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const planInfo = JSON.parse(decodeURIComponent(window.atob(plan.planInfo)));
  const day = planInfo.time.totalDay;

  const goPlan = () => {
    dispatch(scheduleActions.setSchedule(planInfo));
    navigate(`/makeplan/${plan.planId}`);
  };

  return (
    <div
      className="relative w-[22%] h-52 rounded-lg bg-yellow-100 p-2 shadow hover:shadow-lg hover:shadow-orange-200 hover:cursor-pointer"
      onClick={goPlan}
    >
      <div className="flex flex-col w-full h-full bg-white border border-yellow-200 rounded-lg">
        <div className="flex justify-center">
          <div className="w-1/2 h-6 bg-yellow-100 border-b-8 border-yellow-200 rounded-b-md"></div>
        </div>
        <div className="flex-col">
          <p className="pt-1 text-xl font-medium text-center">{plan.planName}</p>
          <p className="pt-4 text-sm text-center">{plan.planDesc}</p>
          <p className="pt-1 text-sm text-center">
            {day - 1}박{day}일
          </p>
          <p className="absolute text-sm bottom-2 right-4">
            {plan.lastModifiedDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSummary;
