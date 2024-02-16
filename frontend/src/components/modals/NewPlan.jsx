import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

import { scheduleActions } from "../../store/scheduleSlice";
import { setHours, setMinutes } from "date-fns";

const NewPlan = (props) => {
  const modalBG = useRef("");
  const [day, setDay] = useState(1);
  const [sleep, setSleep] = useState(day - 1);
  const [startTime, setStartTime] = useState(setHours(setMinutes(new Date(), 0), 10));
  const [endTime, setEndTime] = useState(setHours(setMinutes(new Date(), 0), 22));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = () => {
    const Time = {
      totalDay: day,
      startHour: startTime.getHours(),
      startMinute: startTime.getMinutes(),
      endHour: endTime.getHours(),
      endMinute: endTime.getMinutes(),
      totalTime:
        endTime.getHours() * 60 +
        endTime.getMinutes() -
        startTime.getHours() * 60 -
        startTime.getMinutes(),
      lineCnt: "",
      blackHeight: "",
    };
    dispatch(scheduleActions.setTime(Time));
    props.onClose();
    navigate("/makeplan");
  };

  const change = (e) => {
    if (Number(e.target.value) > 0) {
      setDay(e.target.value);
      setSleep(e.target.value - 1);
    }
  };
  const changeSleep = (e) => {
    if (Number(e.target.value) >= 0) {
      setDay(Number(e.target.value) + 1);
      setSleep(e.target.value);
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={props.onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-4 bg-white rounded-3xl w-96 h-82"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-end">
          <button className="mb-4 text-xl font-semibold hover:text-red-600" onClick={props.onClose}>
            <IoMdClose />
          </button>
        </div>
        <div className="flex justify-center pb-8 font-spoqa">
          <label className="text-xl">계획의 일정을 잡아주세요</label>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <input
              className="rounded-md py-1 text-gray-900 ring-2 ring-gray-400 w-12 text-center focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
              type="number"
              value={sleep}
              onChange={changeSleep}
            />
            <p className="text-lg py-1 px-2">박</p>
            <input
              className="rounded-md py-1 text-gray-900 ring-2 ring-gray-400 w-12 text-center focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
              type="number"
              value={day}
              onChange={change}
            />
            <p className="text-lg py-1 px-2">일</p>
          </div>
          <div className="flex justify-center gap-8">
            <label className="text-lg">시작 시간</label>
            <label className="text-lg"> ~ </label>
            <label className="text-lg">종료 시간</label>
          </div>
          <div className="flex gap-2 justify-center">
            <div>
              <DatePicker
                className="rounded-md py-1.5 text-gray-900 ring-2 ring-gray-400 w-32 focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </div>
            <label className="text-lg"> ~ </label>
            <div>
              <DatePicker
                className="rounded-md py-1.5 text-gray-900 ring-2 ring-gray-400 w-32 focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                onSelect={setHours(22, 0, 0, 0)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-yellow-700 rounded-md bg-yellow-300 ring-1 ring-inset ring-blue-700/10"
              onClick={submit}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPlan;
