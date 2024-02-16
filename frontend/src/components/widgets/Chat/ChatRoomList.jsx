import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

import ButtonChatRoom from "../../../ui/ButtonChatRoom";

const LoadingDiv = () => {
  return <div className="flex flex-col justify-center items-center h-full">
    <ClipLoader />
  </div>
}


const ChatRoomList = ({ onChatRoomSelect }) => {
  const {userId} = useSelector((state) => state.auth);
  const { conceptColor } = useSelector((state) => state.concept)
  const [isLoading, setIsLoading] = useState(true);
  const [chatroomList, setChatroomList] = useState({ chatroomList: [] });

  useEffect(() => {
    
    if (userId) {
      getChatroomList(userId);
    }
  }, [userId]);

  const getChatroomList = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CHAT_REQUEST_URI}/list/${userId}`
      );
      setChatroomList(res.data);
    } catch (error) {
      console.error(error);
    } finally {setIsLoading(false)}
  };

  const enterChatroomHandler = (chatroom) => {
    onChatRoomSelect(chatroom.chatroomName, chatroom.chatroomId, chatroom.userList);
  };
  return (
    <div className="w-auto h-full overflow-auto">
      {chatroomList.chatroomList.length > 0 && chatroomList.chatroomList.map((chatroom) => (
        <div key={chatroom.chatroomId}>
          <ButtonChatRoom onClick={() => enterChatroomHandler(chatroom)} className={`w-[90%] m-1 bg-${conceptColor}-200 rounded-full hover:bg-${conceptColor}-400`}>
            {chatroom.chatroomName}
          </ButtonChatRoom>
        </div>
      ))}
      {isLoading && <LoadingDiv />}
      {!isLoading && chatroomList.chatroomList.length === 0 && <div className="flex flex-col justify-center items-center h-full">
        <p className={`text-lg font-semibold animate-bounce text-${conceptColor}-400`}>열려 있는 채팅방이 없어요</p>
      </div>}
    </div>
  );
};

export default ChatRoomList;
