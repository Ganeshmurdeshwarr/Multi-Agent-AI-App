import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  Square,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessages, setArtifacts } from "../redux/messageSlice";
import {
  addConversation,
  setSelectConversation,
  setConversationTitle,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";
import { createConversation } from "../features/createConversation";

const ChatInput = () => {
  const { selectedConversation } = useSelector((state) => state.conversations);
  const { messages } = useSelector((state) => state.message);
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const dispatch = useDispatch();
  const [selectedAgent, setSelectedAgent] = useState("Auto");

  const handleSendMessage = async () => {
    const prompt = value.trim();

    if (!prompt) return;
    let conversation = selectedConversation;
    if (!conversation) {
      const newConversation = await createConversation();
      dispatch(setSelectConversation(newConversation));
      dispatch(addConversation(newConversation));
      conversation = newConversation;
    }

    if (conversation.title === "New Chat") {
      await updateConversation({
        conversationId: conversation?._id,
        title: prompt,
      });
      dispatch(
        setConversationTitle({
          conversationId: conversation?._id,
          title: prompt,
        }),
      );
    }

    const payload = {
      prompt,
      conversationId: conversation?._id,
      agent: selectedAgent.toLowerCase(),
    };

    dispatch(addMessages({ role: "user", content: prompt }));
    setValue("");
    const data = await sendMessage(payload);
     const latestArtifactsMessage =[...data].reverse().find(msg=>msg.artifacts && msg.artifacts.length > 0)
    dispatch(setArtifacts(latestArtifactsMessage.artifacts || []));
    dispatch(
      addMessages({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },

    {
      id: "image",
      icon: ImageIcon,
      label: "Image",
    },

    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];
  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.label;

            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.label)}
                className={`
            shrink-0
             inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer

            ${
              isActive
                ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/7"
            }
          `}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-white" : "text-slate-500"}
                />

                {agent.label}
              </button>
            );
          })}
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything..."
          rows={3}
          // disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />

        <div className="flex items-center justify-between">
          {/* Left — attach + mic */}
          <div className="flex items-center gap-1">
            {/* <input
              ref={fileRef}
              type="file"
              hidden
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setSelectedFile(file);
                }
              }}
            /> */}
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer"
              // onClick={() => fileRef.current.click()}
            >
              <Paperclip size={16} />
            </button>

            <button
              // onClick={toggleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white"
                  : "text-slate-600 hover:bg-white/5"
              }`}
            >
              {/* {isListening ? <MicOff size={16} /> : <Mic size={16} />} */}
            </button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSendMessage}
            disabled={!value}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150
              ${
                // isLoading
                //   ? "bg-white text-[#0d0f14] hover:bg-slate-200":
                value.trim()
                  ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
