import { useSelector } from "react-redux";

const TimeLine = () => {
  const state = useSelector((state) => state.schedule);
  const lineCnt = state.time.lineCnt;
  let isOclock = [];

  if (state.time.startMinute === 30) isOclock.push(false);
  else isOclock.push(true);

  for (let i = 1; i < lineCnt; i++) {
    isOclock.push(!isOclock[i - 1]);
  }

  return (
    <div className="grid content-between w-full h-full pt-8 grid-cols">
      {[...Array(lineCnt)].map((_, index) => (
        <>
          {isOclock[index] ? (
            <div
              key={index}
              className="w-full border-b border-red-500 opacity-50"
            ></div>
          ) : (
            <div
              key={index}
              className="w-full border-b border-red-500 opacity-25"
            ></div>
          )}
        </>
      ))}
    </div>
  );
};

export default TimeLine;
