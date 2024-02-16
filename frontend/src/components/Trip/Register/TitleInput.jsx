export default function TitleInput({ value, onChange }) {
  return (
    <div className="w-full my-2">
      <label className="mr-10 text-base font-medium">여행 제목</label>
      <input
        type="text"
        name="title"
        placeholder="제목을 작성해주세요"
        value={value}
        onChange={onChange}
        required
        className="border border-neutral-300 rounded-sm text-neutral-700 p-1.5 w-2/3 placeholder:text-neutral-300 text-sm"
      />
    </div>
  );
}
