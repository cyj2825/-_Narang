import { useEffect, useMemo, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";

import { scheduleActions } from "../../store/scheduleSlice";

const Schedule = (props) => {
  const list = useSelector((state) => state.schedule);
  const dispatch = useDispatch();
  const dayList = list.list[props.data.dayIdx];
  const schedule = dayList[props.data.scheduleIdx];
  const blackHeight = list.blackHeight / (list.time.lineCnt - 1) / 3;
  const isCanModify = props.isCanModify;
  let visible = isCanModify ? "visible" : "invisible";

  const blackCSS = {
    height: `${blackHeight}px`,
  };
  const [t, setT] = useState();
  const [text, setText] = useState();
  useEffect(() => {
    setT(schedule.time);
    setText(schedule.comment);
  });
  let scheduleCSS;

  const timeChange = (e) => {
    setT(e.target.value);
    dispatch(
      scheduleActions.setScheduleTime({
        time: e.target.value,
        day: props.data.dayIdx,
        index: props.data.scheduleIdx,
      })
    );
  };

  const textChange = (e) => {
    setText(e.target.value);
    dispatch(
      scheduleActions.setComment({
        comment: e.target.value,
        day: props.data.dayIdx,
        index: props.data.scheduleIdx,
      })
    );
  };

  useMemo(() => {
    const sh = (t * blackHeight) / 10;
    scheduleCSS = { height: `${sh}px` };
  });

  const removeSchedule = () => {
    dispatch(
      scheduleActions.removeSchedule({
        day: props.data.dayIdx,
        index: props.data.scheduleIdx,
      })
    );
  };

  return (
    <>
      {schedule.title ? (
        <Draggable
          draggableId={`${props.data.dayIdx}list_item${props.data.scheduleIdx}`}
          index={props.data.scheduleIdx}
          key={props.data.scheduleIdx}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div
                style={scheduleCSS}
                className="relative z-30 flex flex-col w-56 overflow-hidden text-sm bg-white rounded-xl"
              >
                <div className={`mb-4 absolute right-0 ${visible}`}>
                  <button
                    className="text-xl font-semibold hover:text-red-600"
                    onClick={removeSchedule}
                  >
                    <IoMdClose />
                  </button>
                </div>
                <div className="flex">
                  <img
                    style={scheduleCSS}
                    className="object-contain w-24 rounded-xl"
                    src={schedule.img}
                    alt="이미지"
                  />
                  <div>
                    <p className="text-xs">{schedule.title}</p>
                    <p className="text-xs">
                      <input
                        className="w-20 px-1 text-right"
                        type="number"
                        value={t}
                        onChange={timeChange}
                        step="30"
                        disabled={!isCanModify}
                      />
                      분
                    </p>
                    <textarea
                      className="w-32 text-xs resize-none"
                      name="comment"
                      id="comment"
                      placeholder="간단한 메모"
                      onChange={textChange}
                      value={text}
                      disabled={!isCanModify}
                    />
                    <p className="text-xs">다음 장소까지 {schedule.distance} 분</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ) : (
        <Draggable
          draggableId={`${props.data.dayIdx}list_item${props.data.scheduleIdx}`}
          index={props.data.scheduleIdx}
          key={props.data.scheduleIdx}
          isDragDisabled
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div style={blackCSS} className="bg-black opacity-5"></div>
            </div>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Schedule;
