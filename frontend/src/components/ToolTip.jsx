import { useState } from "react";

function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      <div
        className={`${
          show ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } absolute top-[0.5rem] block whitespace-nowrap py-4 px-4 rounded left-[1.5rem] -ml-[-100%] transform transform-origin-left transition-transform ease-in-out duration-150 bg-stone-100 text-neutral-900 font-semibold text-sm`}
      >
        {text}
      </div>
      <span
        className={`${
          show
            ? "absolute left-[1.2rem] -ml-[-100%] block w-3 h-3 transform rotate-45 -translate-y-1/2 bg-stone-100 rounded-sm top-1/2 transition-transform ease-in-out duration-150"
            : null
        }`}
      ></span>
    </div>
  );
}

export default Tooltip;
