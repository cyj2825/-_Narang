import { useSelector } from "react-redux";

const ShowTime = () => {
  const state = useSelector((state) => state.schedule);
  const lineCnt = state.time.lineCnt;
  let h = Number(state.time.startHour);
  let m = Number(state.time.startMinute);
  const timeList = [];
  for (let i = 0; i < lineCnt; i++) {
    let time = `${h}:${m}`;
    if (h < 10) time = `0${h}:${m}`;
    if (m === 0) time = `${h}:${m}0`;
    if (h < 10 && m === 0) time = `0${h}:${m}0`;
    timeList.push(time);
    m = m + 30;
    if (m === 60) {
      h = h + 1;
      m = 0;
    }
  }

  return (
    <div className="absolute w-8 h-full grid grid-cols content-between pt-6 pb-5">
      {[...Array(lineCnt)].map((_, index) => (
        <div key={index} className={`border-b border-red-600 w-full text-[9px]`}>
          {timeList[index]}
        </div>
      ))}
    </div>
  );
};

export default ShowTime;
