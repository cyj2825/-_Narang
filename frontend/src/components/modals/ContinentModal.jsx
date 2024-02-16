import { useRef, useState } from "react";
import CountryModal from "./CountryModal";
import { ModalPortal } from "./ModalPortal";
import { IoMdClose } from "react-icons/io";

const continents = [
  "동아시아",
  "동남아시아",
  "중앙아시아",
  "서남아시아",
  "유럽",
  "오세아니아",
  "아프리카",
  "북아메리카",
  "남아메리카",
];

const ContinentModal = ({
  onClose,
  onSelectedContinent,
  onSelectedCountry,
  onSelectedCity,
}) => {
  const modalBG = useRef("");

  const [selectedContinent, setSelectedContinent] = useState(null);

  // 대륙 선택 함수
  const handleContinentSelect = (continent) => {
    setSelectedContinent(continent);
    onSelectedContinent(continent);
  };

  // 뒤로 가기 함수
  const handleBack = () => {
    setSelectedContinent(null);
    onSelectedContinent("");
  };

  const onContinentClose = () => {
    onClose();
    setSelectedContinent(null);
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={onContinentClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-8 bg-white w-[28rem] h-[40rem] rounded-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className=" font-spoqa">
          <div className="flex justify-end">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onContinentClose}
            >
              <IoMdClose />
            </button>
          </div>
          <p className="m-3 text-lg font-bold text-center">
            대륙🌍을 선택해주세요!
          </p>
          <div className="inline-block mb-4 align-middle">
            <div className="flex flex-wrap justify-center">
              {continents.map((continent) => (
                <button
                  className="w-[10rem] h-[4.5rem] m-3 text-base rounded-xl bg-stone-100 hover:bg-amber-200"
                  key={continent}
                  onClick={() => handleContinentSelect(continent)}
                >
                  {continent}
                </button>
              ))}
            </div>

            {selectedContinent && (
              <ModalPortal>
                <CountryModal
                  isOpen={true}
                  onClose={onContinentClose}
                  selectedContinent={selectedContinent}
                  onSelectedCountry={onSelectedCountry}
                  onSelectedCity={onSelectedCity}
                  onBack={handleBack}
                />
              </ModalPortal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinentModal;
