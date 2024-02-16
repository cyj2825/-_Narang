const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className={`text-xs ${checked ? 'font-semibold text-indigo-700' : 'hover:text-indigo-700 hover:font-semibold'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="m-1.5"
      />
      {label}
    </label>
  );
};

export default Checkbox;