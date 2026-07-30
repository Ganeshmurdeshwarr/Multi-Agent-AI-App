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
  X,
  Zap,
} from "lucide-react";
import React, { useRef, useState } from "react";
import sendMessage from "../features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, addMessages, setArtifacts, setIsLoading } from "../redux/messageSlice";
import {
  addConversation,
  setSelectConversation,
  setConversationTitle,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversation";
import { createConversation } from "../features/createConversation";

const ChatInput = () => {
  const { selectedConversation } = useSelector((state) => state.conversations);
  const { messages , isLoading} = useSelector((state) => state.message);
  console.log(messages);
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const dispatch = useDispatch();
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileRef = useRef(null);

  const handleSendMessage = async () => {
    dispatch(setIsLoading(true))
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

    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    if(selectedFile){
      formData.append("file", selectedFile);
    }

    dispatch(addMessages({ role: "user", content: prompt }));
    setValue("");
    const data = await sendMessage(formData);
    dispatch(setIsLoading(false))

    setSelectedFile(null)
    if (!data) return;
    if (data.artifacts?.length > 0) {
      dispatch(setArtifacts(data.artifacts));
    }

    dispatch(
      addMessages({
        role: "assistant",
        content: data?.answer,
        images: data?.images || [],
        artifacts: data.artifacts || [],
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

        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2 ">
              {selectedFile.type === "application/pdf" ? (
                <FileText size={16} className="text-red-400" />
              ) : (
                selectedFile.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-xl object-cover mt-3"
                  />
                )
              )}


            <div className="">
              <p className="text-xs text-white">{selectedFile?.name}</p>
              <p className="text-[10px] text-slate-500">
                {Math.ceil(selectedFile.size)}KB
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                fileRef.current.value = "";
              }}
              className="ml-2"
            >
              <X className="text-slate-500 hover:text-white" size={14} />
            </button>
            </div>

          </div>
        )}

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
            <input
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
            />

            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer"
              onClick={(e) => {
                fileRef.current.click();
              }}
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
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSendMessage}
            disabled={!value.trim() || isLoading}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150
              ${
                isLoading
                  ? "bg-white text-[#0d0f14] hover:bg-slate-200":
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
