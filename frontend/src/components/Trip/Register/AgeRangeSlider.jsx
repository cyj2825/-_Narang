import React, { Fragment, useState } from "react";

const AgeRangeSection = ({ onRangeChange }) => {
  const [leftValue, setLeftValue] = useState(2);
  const [rightValue, setRightValue] = useState(7);
  const [leftPercent, setLeftPercent] = useState(0);
  const [rightPercent, setRightPercent] = useState(100);

  const handleLeftChange = (e) => {
    let newValue = parseInt(e.target.value);

    if (rightValue - newValue <= 0) {
      newValue = rightValue;
    }

    setLeftValue(newValue);
    setLeftPercent(((newValue - 2) / (7 - 2)) * 100);
    onRangeChange(newValue, rightValue);
  };

  const handleRightChange = (e) => {
    let newValue = parseInt(e.target.value);

    if (newValue - leftValue <= 0) {
      newValue = leftValue;
    }

    setRightValue(newValue);
    setRightPercent(((newValue - 2) / (7 - 2)) * 100);
    onRangeChange(leftValue, newValue);
  };

  return (
    <Fragment>
      <div className="relative w-2/3 h-2 bg-gray-100 rounded-2xl">
        <div
          className="absolute h-2 bg-gray-400 rounded-2xl "
          style={{
            left: `${leftPercent}%`,
            right: `${100 - rightPercent}%`,
          }}
        />
        <input
          type="range"
          className="absolute w-full h-2 bg-transparent appearance-none "
          min="2"
          max="7"
          step="1"
          value={leftValue}
          onChange={(e) => {
            handleLeftChange(e);
          }}
        />
        <input
          type="range"
          className="absolute w-full h-2 bg-transparent appearance-none "
          min="2"
          max="7"
          step="1"
          value={rightValue}
          onChange={(e) => {
            handleRightChange(e);
          }}
        />
        {[20, 30, 40, 50, 60, 70].map((labelValue) => (
          <label
            key={labelValue}
            className="absolute text-xs text-gray-500 -translate-x-1/2 top-4"
            style={{
              left: `${((labelValue - 20) / 50) * 100}%`,
            }}
          >
            {labelValue}
          </label>
        ))}
      </div>
      <style>
        {`
          input[type="range"] {
            pointer-events: none;
          }

          input[type="range"]::-webkit-slider-thumb {
          height: 1rem;
          width: 1rem;
          border-radius: 50%;
          border: 2px solid #b0b0b0;
          background-color: white;
          -webkit-appearance: none;
          pointer-events: auto;
          }
        `}
      </style>
    </Fragment>
  );
};

export default AgeRangeSection;
