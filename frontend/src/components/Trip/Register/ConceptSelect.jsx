export default function ConceptSelect({ value, onChange }) {
  // 여행 테마
  const conceptList = ["낭만", "건축", "모험", "자유", "쇼핑", "휴양", "핫플"];
  // 전체 conceptList어떻게 할지 같이 정해야함 -> redux-toolkit에 저장해야 할 것으로 보임
  return (
    <div className="w-full my-2">
      <label className="mr-10 text-base font-medium">여행 컨셉</label>
      <select
        name="concept"
        value={value !== '' ? value : conceptList[0]}
        onChange={onChange}
        className="w-2/3 p-1.5 border rounded-sm border-neutral-300 text-neutral-700 text-sm"
      >
        {conceptList.map((option, index) => (
          <option className="text-sm" key={index} id={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
