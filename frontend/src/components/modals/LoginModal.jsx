import { useRef } from "react";
import { IoMdClose } from "react-icons/io";

const LoginModal = (props) => {
  const modalBG = useRef(null);
  const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const kakaoRedirectURI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  const naverClientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const naverRedirectURI = import.meta.env.VITE_NAVER_REDIRECT_URI;
  const naverState = "false";
  const kakaoLoginURI = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${kakaoRedirectURI}&response_type=code&prompt=login`;
  const naverLoginURI = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&state=${naverState}&redirect_uri=${naverRedirectURI}`;

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={props.onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-4 bg-white rounded-3xl w-96 h-80"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="font-spoqa">
          <div className="flex justify-end mr-1">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={props.onClose}
            >
              <IoMdClose />
            </button>
          </div>
          <p className="mb-10 text-xl font-extrabold text-center">
            나랑 로그인🛫
          </p>
          <div className="flex flex-col items-center">
            <a href={naverLoginURI}>
              <img
                className="object-cover  w-[200px] rounded-xl m-2"
                src="assets/naver_login.png"
              />
            </a>
            <a href={kakaoLoginURI}>
              <img
                className="object-cover w-[200px] rounded-xl m-2"
                src="assets/kakao_login.png"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
