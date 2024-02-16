import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { scheduleActions } from "../../store/scheduleSlice";

import Schedule from "./Schedule";
import TimeLine from "./TimeLine";

const DayPlan = (props) => {
  const list = useSelector((state) => state.schedule).list;
  const divRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(scheduleActions.setBlackHeight(divRef.current.clientHeight - 32));
  }, [dispatch]);

  return (
    <div
      ref={divRef}
      className="relative h-full p-2 overflow-hidden bg-amber-100 w-60 rounded-xl"
    >
      {props.index + 1} 일
      {list[props.index].map((data, index) => (
        <Schedule
          data={{ dayIdx: props.index, scheduleIdx: index }}
          isCanModify={props.isCanModify}
          key={index}
        />
      ))}
      <div className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none">
        <TimeLine />
      </div>
    </div>
  );
};

export default DayPlan;
