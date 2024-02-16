export default function PositionCheck({ value, onChange }) {
  // 여행 테마
  const positionList = [
    "요리 강령술사",
    "여행 초보자",
    "기억 수호자",
    "언어 마법사",
    "지갑 전사",
    "여행 연금술사",
    "푸드 파이터",
    "트렌드 사냥꾼",
    "사진 도사",
    "운전 기사",
    "길잡이",
    "패션 요정"
  ];

  const handleCheckboxChange = (position) => {
    const updatedPositions = [...value];

    if (updatedPositions.includes(position)) {
      // 이미 선택된 포지션이면 제거
      updatedPositions.splice(updatedPositions.indexOf(position), 1);
    } else {
      // 선택되지 않은 포지션이면 추가
      updatedPositions.push(position);
    }

    onChange(updatedPositions);
  };

  return (
    <div className="w-full my-2">
      <div className="flex flex-wrap justify-around">
        {positionList.map((position, index) => (
          <div key={index} className="w-[24] p-2 itme">
            <label
              className={`inline-flex items-center px-2.5 py-2.5 text-sm font-medium text-neutral-600 rounded-2xl cursor-pointer ring-1 ring-inset ring-neutral-400/10 hover:bg-neutral-400 hover:bg-opacity-30 ${
                value.includes(position)
                  ? " bg-neutral-400 bg-opacity-30 "
                  : "bg-neutral-50"
              }`}
            >
              <input
                type="checkbox"
                value={position}
                checked={value.includes(position)}
                onChange={() => handleCheckboxChange(position)}
                className="hidden"
              />
              {position}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
