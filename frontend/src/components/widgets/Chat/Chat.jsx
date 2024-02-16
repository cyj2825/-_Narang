import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { MdArrowBack } from "react-icons/md";
import { useInView } from "react-intersection-observer";

import Button from "../../../ui/Button";

const stompEndpoint = "wss://i10a701.p.ssafy.io/api/message/chat";
const Chat = ({ chatroomName, chatroomId, navigateBack, userList }) => {
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState("");
  const [loadingChatMore, setLoadingChatMore] = useState(true)
  const { userId } = useSelector((state) => state.auth);
  const lastChatRef = useRef("");
  const [prevScrollHeight, setPrevScrollHeight] = useState(null);
  const chatDivRef = useRef(null);
  let stompClient = useRef(null);
  const [pageNo, setPageNo] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '10px' // div태그가 보일 때 inView가 true로 설정
  });


  const getChatList = useCallback(async (chatroomId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_CHAT_REQUEST_URI}/${chatroomId}?page=${pageNo}`); //데이터 가져오기 20개 단위
      if (response.data.chatList.length === 0) {
        return;
      } // 없으면 그냥 리턴
      let chatList = response.data.chatList;
      if (pageNo === 0) {
        lastChatRef.current = chatList[chatList.length - 1]?.chatId; //처음 렌더링 시 마지막 채팅 기억
      } else {
        const lastIndex = chatList.findIndex(chat => chat.chatId === lastChatRef.current); //겹치는 채팅 인덱스 찾기
        if (lastIndex !== -1) {
          chatList = chatList.slice(lastIndex + 1);
        } //없으면 그대로 반환, 있으면 잘라내기
      }
      chatList = [...chatList].reverse();
      setChats((prevData) => [...chatList, ...prevData]);
      setPageNo((prevPageNo) => prevPageNo + 1);
      //채팅이 들어오는게 역 순서로 들어오기 때문에 뒤집어서 저장
    } catch (error) {
      console.error("채팅 목록 가져오는 중 에러 발생:", error);
    }
  }, [chatroomId, pageNo]);
  // inView가 true일때 데이터를 가져옴

  const handleFetchMessageMore = () => {
    setLoadingChatMore(true);
    const currentScrollHeight = chatDivRef.current.scrollHeight;
    setPrevScrollHeight(currentScrollHeight);
    getChatList(chatroomId).finally(() => setLoadingChatMore(false));
  } //chatList가져올때 경우에 따라 scroll로직을 다르게 하기 위한 loadingChatMore 설정 및 당시 scroll높이 기억

  useEffect(() => {
    if (inView) {
      handleFetchMessageMore();
    }
  }, [inView]); //infinity scroll 구현

  useEffect(() => {

    if (pageNo === 1 && chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight
      return;
    }

    if (chatDivRef.current) {
      chatDivRef.current.scrollTo({
        top: chatDivRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [chats]); // chat 업데이트시 제일 아래로 이동

  useEffect(() => {
    if (!loadingChatMore && prevScrollHeight !== null && pageNo > 1) {
      const newScrollHeight = chatDivRef.current.scrollHeight;
      const scrollOffset = newScrollHeight - prevScrollHeight;
      chatDivRef.current.scrollTop = scrollOffset; // 새로 로드된 메시지의 높이만큼 스크롤 이동
      setPrevScrollHeight(null); // prevScrollHeight 상태 초기화
    }
  }, [chats, loadingChatMore, prevScrollHeight]);


  useEffect(() => {
    if (!stompClient.current) {
      // stompClient 인스턴스 초기화 확인
      const socket = new WebSocket(stompEndpoint);
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        onConnect: (frame) => {
          // 구독 설정
          stompClient.current.subscribe(
            `/sub/chat/room/${chatroomId}`,
            (message) => {
              const messageBody = JSON.parse(message.body);
              const chat = {
                userId: messageBody.userId,
                sendTime: messageBody.sendTime,
                content: messageBody.content,
              };
              setChats((prevChats) => [...prevChats, chat]);
              chatDivRef.current.scrollTo({
                top: chatDivRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
          );
        },
      });
      stompClient.current.activate(); // 웹소켓 연결 활성화
    }

    // 컴포넌트 언마운트 시 연결 종료 처리
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [chatroomId]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (!msg.trim()) return; // 메시지가 비어있는 경우 전송하지 않음

    // 메시지 전송
    if (stompClient.current) {
      stompClient.current.publish({
        destination: "/pub/chat/send",
        body: JSON.stringify({
          chatroomId: chatroomId,
          senderId: userId,
          content: msg,
        }),
      });
      setMsg(""); // 메시지 전송 후 입력 필드 초기화
    }
  };

  const getNicknameById = (id) => {
    for (let i = 0; i < userList.length; i++) {
      if (userList[i].id == id) {
        return userList[i].nickname;
      }
    }
    // 해당 id를 가진 객체가 없을 경우 예외 처리
    return "???";
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 right-0">
        <div className="p-2">
          {chatroomName}
        </div>
      </div>
      <div className="absolute top-0 left-0">
        <button onClick={navigateBack} className="p-2">
          <MdArrowBack className="text-2xl" />
        </button>
      </div>

      <div
        id="chats"
        ref={chatDivRef}
        className="h-full pt-5 pb-6 pr-4 overflow-y-scroll"
      >
        <div ref={ref}></div>
        {chats.map((chat) => {
          const utcDate = new Date(chat.sendTime);
          const kstDate = new Date(utcDate.getTime());
          // 한국 시간대로 변환 (UTC+9)
          const formattedDate = `${kstDate.getHours()}시 ${kstDate.getMinutes()}분`;
          let messageBoxClass = "w-full flex m-3 items-end";
          let messageClass =
            "text-sm text-left rounded-lg border p-2 max-w-[80%] break-words";
          if (chat.userId === "관리자") {
            messageBoxClass += " justify-center"; // 관리자 일 땐 가운데
            messageClass += " bg-gray-200 w-[80%] border-gray-200";
            return (
              <div key={chat.chatId} className={messageBoxClass}>
                <div className={messageClass}>{chat.content}</div>
              </div>
            );
          } else if (chat.userId === userId) {
            messageBoxClass += " justify-end my-1"; // 본인인 건 오른쪽
            messageClass += " bg-yellow-200 border-yellow-300";
            return (
              <Fragment key={chat.chatId}>
                <div className="justify-end m-0 text-xs text-right">나</div>
                <div className={messageBoxClass}>
                  <div className="mr-1 text-xs">{formattedDate}</div>
                  <div className={messageClass}>{chat.content}</div>
                </div>
              </Fragment>
            );
          } else {

            messageBoxClass += " justify-start my-1"; // 상대방은 왼쪽
            messageClass += " bg-white";
            const otherUserNickname = getNicknameById(chat.userId);
            return (
              <Fragment key={chat.chatId}>
                <div className="ml-1 text-xs text-left">{otherUserNickname}</div>
                <div className={messageBoxClass}>
                  <div className={messageClass}>{chat.content}</div>
                  <div className="ml-1 text-xs">{formattedDate}</div>
                </div>
              </Fragment>
            );
          }
        })}
      </div>

      <form
        onSubmit={submitHandler}
        className="absolute bottom-0 left-0 right-0 flex items-center bg-white"
      >
        <input
          type="text"
          placeholder="메시지 입력해주세요"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="flex-grow p-2 mr-2 border rounded-lg focus:outline-none"
        />
        <Button type="submit">전송</Button>
      </form>
    </div>
  );
};

export default Chat;
