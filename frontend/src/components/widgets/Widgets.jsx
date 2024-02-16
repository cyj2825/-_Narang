import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import CalendarCp from "./CalendarCp";
import ChatRoomList from "./Chat/ChatRoomList";
import Chat from "./Chat/Chat";

export default function Widgets() {
  const {isLogin} = useSelector((state) => state.auth);
  const { conceptColor} = useSelector((state => state.concept))
  const [activeChatRoomList, setActiveChatRoomList] = useState(true);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [selectedChatRoomName, setSelectedChatRoomName] = useState("");
  const [selectedUserList, setSelectedUserList] = useState([]);
  const chatScrollRef = useRef(null);

  const handleChatRoomSelect = (chatroomName, chatroomId, userList) => {
    setSelectedChatRoomName(chatroomName)
    setSelectedChatRoomId(chatroomId);
    setActiveChatRoomList(false);
    setSelectedUserList(userList)
  };
  
  const navigateBack = () => {
    setActiveChatRoomList(true);
    setSelectedChatRoomId(null); // 선택된 채팅방 ID를 초기화
  };
  return (
    <div className="text-center relative ">
     
      <CalendarCp />
      <div className="h-[42svh] mt-3 bg-blue-200 rounded-lg" ref={chatScrollRef}>
        {!isLogin && (
          <div className="flex flex-col justify-center items-center h-full">
          <p className={`text-lg font-semibold animate-bounce text-${conceptColor}-400`}>채팅을 사용하려면</p>
          <p className={`text-lg font-semibold animate-bounce text-${conceptColor}-400`}>로그인을 먼저 해주세요</p>
        </div>
        )}
        {isLogin &&
          (activeChatRoomList ? (
            <ChatRoomList onChatRoomSelect={handleChatRoomSelect} />
          ) : (
            <Chat chatroomId={selectedChatRoomId} navigateBack={navigateBack} chatroomName={selectedChatRoomName} userList={selectedUserList} />
          ))}
      </div>
    </div>
  );
}
