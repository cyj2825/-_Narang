// components/CountryModal.js
import { useRef, useState } from "react";
import CityModal from "./CityModal";
import { ModalPortal } from "./ModalPortal";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";

const countryData = {
  동아시아: ["한국", "일본", "홍콩", "대만", "중국", "몽골"],
  동남아시아: [
    "싱가포르",
    "미얀마",
    "캄보디아",
    "필리핀",
    "말레이시아",
    "인도네시아",
    "태국",
    "베트남",
  ],
  중앙아시아: ["우즈베키스탄", "티베트"],
  서남아시아: ["아랍에미리트", "몰디브", "인도", "사우디아라비아"],
  유럽: [
    "스위스",
    "프랑스",
    "영국",
    "이탈리아",
    "포르투갈",
    "스페인",
    "독일",
    "오스트리아",
    "크로아티아",
  ],
  오세아니아: ["호주", "뉴질랜드", "팔라우"],
  아프리카: ["이집트", "나미비아", "수단"],
  북아메리카: ["미국", "멕시코", "캐나다"],
  남아메리카: ["브라질", "아르헨티나", "페루", "우루과이", "볼리비아"],
};

const CountryModal = ({
  onClose,
  selectedContinent,
  onBack,
  onSelectedCountry,
  onSelectedCity,
}) => {
  const modalBG = useRef("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  // 나라 선택 함수
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    onSelectedCountry(country);
  };

  // 뒤로 가기 함수
  const handleBack = () => {
    setSelectedCountry(null);
    onSelectedCountry("");
  };

  const onCountryClose = () => {
    onClose();
    setSelectedCountry(null);
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-0"
      onClick={onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-8 bg-white w-[28rem] h-[40rem] rounded-3xl"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className=" font-spoqa">
          <div className="flex justify-between">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-500"
              onClick={onBack}
            >
              <IoIosArrowBack />
            </button>
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          </div>
          <p className="m-3 text-lg font-bold text-center">
            나라🗺를 선택해주세요!
          </p>
          <div className="inline-block mb-4 align-middle">
            <div className="flex flex-wrap justify-center">
              {countryData[selectedContinent].map((country) => (
                <button
                  className="w-[10rem] h-[4.5rem] m-3 text-base rounded-xl bg-stone-100 hover:bg-amber-200"
                  key={country}
                  onClick={() => handleCountrySelect(country)}
                >
                  {country}
                </button>
              ))}
            </div>

            {selectedCountry && (
              <ModalPortal>
                <CityModal
                  isOpen={true}
                  onClose={onCountryClose}
                  selectedCountry={selectedCountry}
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

export default CountryModal;
