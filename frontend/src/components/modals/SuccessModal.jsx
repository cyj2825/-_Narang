import { useRef } from "react";
import { IoMdClose } from "react-icons/io";

const SuccessModal = (props) => {
  const modalBG = useRef("");

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={props.onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-8 bg-white w-[28rem] h-[16rem] rounded-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className=" font-spoqa">
          <div className="flex justify-end">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={props.onClose}
            >
              <IoMdClose />
            </button>
          </div>

          <div className="items-center mt-5 text-center">
            <p className="mb-4 font-semibold text-ml">
              동행 신청이 완료되었습니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
