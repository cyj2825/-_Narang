export default function GenderRadio({ value, onChange }) {
  // 여행 테마
  const genderList = ["여성", "남성", "상관없음"];
  // 전체 conceptList어떻게 할지 같이 정해야함 -> redux-toolkit에 저장해야 할 것으로 보임
  return (
    <div className="w-full my-2">
      <label className="mr-10 text-sm font-medium">모집 성별</label>
      {genderList.map((option, index) => (
        <label className="items-center m-2 text-xs" key={index} id={option}>
          <input
            type="radio"
            name="gender"
            placeholder="모집 성별을 선택해주세요"
            value={option}
            onChange={onChange}
            required
            className="m-1 text-xs"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
