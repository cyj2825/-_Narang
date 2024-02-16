import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { conceptTemaBannerColorObject } from "../data/concepts";
import { authActions } from "../store/authSlice";
import { ModalPortal } from "./modals/ModalPortal";
import Dropdown from "./UpNavDropdown";
import LoginModal from "./modals/LoginModal";
import TalkBubble from "../ui/TalkBubble";

const AlertAnimation = ({ color }) => {
  return (
    <span className="relative flex w-3 h-3">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}
        style={{ right: -22, top: "-8px" }}
      ></span>
      <span
        className={`absolute inline-flex rounded-full h-3 w-3 ${color}`}
        style={{ right: -22, top: "-8px" }}
      ></span>
    </span>
  );
};

const UpperNavbar = () => {
  const [emptyMessage, setEmptyMessage] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { concept } = useSelector((state) => state.concept);
  const conceptColorClass = conceptTemaBannerColorObject[concept];
  const { isLogin, userId, alertAmount } = useSelector((state) => state.auth);
  const sessionToken = window.sessionStorage.getItem("token");
  const sessionRefreshToken = window.sessionStorage.getItem("refreshToken");

  const getAlertData = useCallback(
    async (userId) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_ALERT_REQUEST_URI}/list/${userId}`
        );
        if (alertAmount !== res.data.alertList.length) {
          dispatch(
            authActions.SetAlertAmount({
              alertAmount: res.data.alertList.length,
            })
          );
          setAlertContent(
            `현재 알림이 ${res.data.alertList.length}개 와 있습니다.`
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isLogin && sessionToken !== null && sessionRefreshToken !== null) {
      (async () => {
        try {
          const userRes = await axios.get(
            `${import.meta.env.VITE_USER_REQUEST_URI}/getuser`,
            {
              headers: {
                Authorization: sessionToken,
                "Authorization-refresh": sessionRefreshToken,
              },
            }
          );
          dispatch(
            authActions.Login({
              token: sessionToken,
              refreshToken: sessionRefreshToken,
              userId: userRes.data.id,
              nickname: userRes.data.nickname,
            })
          );
        } catch (error) {
          console.error("유저받아오면서 문제생김 : ", error);
        }
      })();
    }
  }, [isLogin, userId, sessionRefreshToken, sessionToken]);

  useEffect(() => {
    if (userId === "") {
      return;
    }
    getAlertData(userId);

    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(
      `${import.meta.env.VITE_ALERT_REQUEST_URI}/subscribe/${userId}`,
      {
        heartbeatTimeout: 3600000,
      }
    );

    eventSource.addEventListener("sse", (event) => {
      const { data: receivedConnectData } = event;
      if (receivedConnectData === `EventStream Created. [userId=${userId}]`) {
        console.log("SSE CONNECTED");
      } else {
        const data = JSON.parse(receivedConnectData);
        dispatch(authActions.SetAlertAmount({ alertAmount: alertAmount + 1 }));
        setAlertContent(makeAlertContent(data));
      }
    });
    eventSource.onerror = function (event) {
      console.error("SSE 에러 발생:", event);
    };
    return () => {
      eventSource.close();
    };
  }, [userId]);

  useEffect(() => {
    if (alertContent !== "") {
      setEmptyMessage(false);
      setAlertAnimation();
    }
  }, [alertContent]);

  const navigateHome = () => {
    navigate("/");
  };
  const OpenLoginModal = () => {
    setIsOpen(true);
  };

  const CloseLoginModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const setAlertAnimation = () => {
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 4500);
  };

  const makeAlertContent = (event) => {
    switch (event.alertType) {
      case "REQUEST":
        return `${event.senderName}님이 ${event.tripName}에 ${JSON.parse(
          decodeURIComponent(window.atob(event.position))
        )} 포지션으로 참여를 희망합니다`;
      case "ACCEPT":
        return `${event.senderName}님이 ${event.tripName}의 참여를 허락했습니다.`;
      case "REJECT":
        return `${event.tripName}의 참여가 거절당했습니다.`;
      default:
        return `${event.alertType} : 알 수 없는 알림입니다.`;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full p-4 bg-stone-100 ">
      <div className="ml-5">
        <img
          src="/narang_logo.png"
          className="w-11 h-11 hover:cursor-pointer"
          onClick={navigateHome}
          alt="Home"
        />
      </div>
      {sessionToken === null && (
        <button onClick={OpenLoginModal} className="mr-5 hover:font-semibold">
          Login
        </button>
      )}
      {sessionToken !== null && (
        <div className="relative flex justify-between space-x-4">
          <Link to="/applicantList" className="relative flex items-center">
            {alertAmount > 0 && <AlertAnimation color={conceptColorClass} />}
            🔔
          </Link>
          {!emptyMessage && (
            <TalkBubble content={alertContent} isVisible={isVisible} />
          )}
          <Dropdown />
        </div>
      )}
      {isOpen && (
        <ModalPortal>
          <LoginModal onClose={CloseLoginModal} />
        </ModalPortal>
      )}
    </header>
  );
};

export default UpperNavbar;
