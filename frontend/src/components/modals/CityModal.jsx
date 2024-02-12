import { useRef, useState } from "react";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";

const cityData = {
  한국: ["서울", "강원도", "경상도", "충청도", "전라도", "제주도", "울릉도"],
  일본: ["오사카", "도쿄", "후쿠오카", "삿포로", "교토", "다카마츠"],
  홍콩: ["홍콩"],
  대만: ["대만"],
  중국: ["베이징", "상하이", "충칭", "하얼빈", "청두"],
  몽골: ["울란바토르"],
  싱가포르: ["싱가포르"],
  미얀마: ["양곤", "바간"],
  캄보디아: ["씨엠립", "프놈펜"],
  필리핀: ["세부", "마닐라", "보라카이"],
  말레이시아: ["쿠알라룸푸르", "페낭", "코타키나발루", "랑카위", "조호바루"],
  인도네시아: ["발리", "자카르타", "족자카르타", "롬복"],
  태국: ["방콕", "푸켓", "치앙마이", "끄라비", "파타야"],
  베트남: ["호치민", "하노이", "호이안", "다낭", "달랏", "나트랑", "사파"],
  우즈베키스탄: ["우즈베키스탄"],
  티베트: ["티베트"],
  아랍에미리트: ["두바이", "아부다비"],
  몰디브: ["몰디브"],
  인도: ["뭄바이", "델리", "아그라", "바라나시"],
  사우디아라비아: ["사우디아라비아"],
  스위스: ["스위스"],
  프랑스: ["파리", "니스", "마르세유"],
  영국: ["런던", "리버풀", "맨체스터"],
  이탈리아: ["로마", "나폴리", "베네치아"],
  포르투갈: ["리스본"],
  스페인: ["바르셀로나", "마드리드", "세비야"],
  독일: ["함부르크", "뮌헨", "베를린"],
  오스트리아: ["비엔나", "잘츠부르크"],
  크로아티아: ["두브로브니크", "스플리트", "플리트비체"],
  호주: ["브리즈번", "시드니", "멜버른"],
  뉴질랜드: ["오클랜드", "웰링턴", "크라이스트처치"],
  팔라우: ["팔라우"],
  이집트: ["카이로"],
  나미비아: ["나미비아"],
  수단: ["수단"],
  미국: ["뉴욕", "로스앤젤레스", "샌프란시스코", "샌디에이고"],
  멕시코: ["멕시코시티", "칸쿤", "구아다라하라"],
  캐나다: ["토론토", "밴쿠버", "몬트리올"],
  브라질: ["리우데자네이루", "상파울루", "살바도르"],
  아르헨티나: ["부에노스아이레스", "코르도바", "몬테비데오"],
  페루: ["리마", "쿠스코", "아레키파"],
  우루과이: ["몬테비데오", "푼타델에스테", "콜로니아델사크라멘토"],
  볼리비아: ["라파스", "수크레", "코카밤바"],
};

const CityModal = ({
  onBack,
  onClose,
  selectedCountry,
  onSelectedCity
}) => {
  const modalBG = useRef("");

  const [selectedCity, setSelectedCity] = useState(null);

  const handleCountrySelect = (city) => {
    setSelectedCity(city);
    // 도시를 선택한 후 상위 컴포넌트로 도시 정보를 전달
    onSelectedCity(city);
    // 모달을 닫음
    onClose();
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center bg-gray-100 bg-opacity-0"
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
            도시🗽를 선택해주세요!
          </p>
          <div className="inline-block mb-4 align-middle">
            <div className="flex flex-wrap justify-center">
              {cityData[selectedCountry].map((city) => (
                <button
                className="w-[10rem] h-[4.5rem] m-3 text-base rounded-xl bg-stone-100 hover:bg-amber-200"
                  key={city}
                  onClick={() => handleCountrySelect(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityModal;
