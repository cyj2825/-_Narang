import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Button from "../../../ui/Button";

const ChatRoomList = ({ onChatRoomSelect }) => {
  const userId = useSelector((state) => state.auth.userId);
  const {conceptColor} = useSelector((state) => state.concept)
  const [chatroomList, setChatroomList] = useState({ chatroomList: [] });
  useEffect(() => {
    if (userId) {
      getChatroomList(userId);
    }
  }, [userId]);

  

  const getChatroomList = async (userId) => {
    try {
      const res = await axios.get(
        `https://i10a701.p.ssafy.io/api/message/chat/list/${userId}`
      );
      setChatroomList(res.data);
      console.log("res data", res.data)
      console.log(chatroomList)

    } catch (error) {
      console.error(error);
    }
  };

  const enterChatroomHandler = (chatroom) => {
    onChatRoomSelect(chatroom.chatroomName, chatroom.chatroomId);
  };
  return (
    <div className="w-auto">
      {chatroomList.chatroomList.map((chatroom) => (
        <div key={chatroom.chatroomId}>
          <Button onClick={() => enterChatroomHandler(chatroom)} className={`w-[90%] m-1 bg-${conceptColor}-200 rounded-full`}>
            {chatroom.chatroomName}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
