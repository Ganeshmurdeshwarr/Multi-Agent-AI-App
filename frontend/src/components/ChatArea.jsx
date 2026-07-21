import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MessageList from "./MessageList";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import ChatInput from "./ChatInput";
import getMessages from "../features/getMessages";

const ChatArea = () => {
  const { selectedConversation } = useSelector((state) => state.conversations);
  const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      if (!selectedConversation) {
        dispatch(setMessages([]));
        return;
      }
      if (selectedConversation) {
        if (selectedConversation.title == "New Chat") {
          dispatch(setMessages([])); 
          return;
        }
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMsg();
  }, [selectedConversation?._id]);
  console.log("Selected Conversation:", selectedConversation);
  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
