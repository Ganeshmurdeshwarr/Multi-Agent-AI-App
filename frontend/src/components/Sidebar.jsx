import React, { useEffect, useState } from "react";
import {
  CoinsIcon,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftIcon,
  PanelRightIcon,
  PenSquare,
  Plus,
  User,
  X,
} from "lucide-react";
import { getConversations } from "../features/getConversations";
import {
  addConversation,
  setConversations,
  setSelectConversation,
} from "../redux/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../features/createConversation";
import logout from "../features/logout";
import { setUserData } from "../redux/userSlice";
import BillingDrawer from "./BillingDrawer";
import { setMessages } from "../redux/messageSlice"

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversations,
  );
  const { userData } = useSelector((state) => state.user);
  const [imageError, setImageError] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!userData) return;
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [userData?._id]);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
    dispatch(setSelectConversation(data));
    dispatch(setMessages([]));
  };

useEffect(() => {
  document.body.style.overflow = mobileOpen ? "hidden" : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [mobileOpen]);

  const handleSelectConversation = async (conversation) => {
    setMobileOpen(false);
    dispatch(setSelectConversation(conversation));
    // const messages = await getMessages(conversation._id);
    // dispatch(setMessages(messages));
    //  dispatch(setArtifacts(messages.artifacts));
  };

  if (collapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center w-14 h-screen bg-[#0d0f14] border-r border-white/6 py-4 gap-1 shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/6 transition-colors duration-150 bg-transparent border-none cursor-pointer mb-1"
          onClick={() => setCollapsed(false)}
        >
          <PanelRightIcon />
        </button>

        <button
          onClick={handleCreateConversation}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
        >
          <Plus size={17} />
        </button>

        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto w-full px-2 scrollbar-none [&::-webkit-scrollbar]:hidden pt-5">
          {conversations.map((chat, idx) => {
            const isActive = selectedConversation?._id === chat._id;
            return (
              <div
                key={chat._id}
                onClick={() => handleSelectConversation(chat)}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-150 border-none cursor-pointer
                ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 w-5 h-5 rounded-lg transition-colors duration-150
                  ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/6 text-slate-500"}
                  `}
                >
                  <MessageSquare size={15} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto">
          {userData && (
            <div className="relative">
              {userData?.user?.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-8 h-8 rounded-4 object-cover border-2 border-indigo-500/25"
                />
              ) : (
                <div className="w-8 h-8 rounded-4 bg-white/6 flex items-center justify-center">
                  <User size={14} className="text-slate-400" />
                </div>
              )}
              <span className="absolute -bottom-px -right-px w-2 h-2 bg-green-500 rounded-full border-[1.5px] border-[#0d0f14] block" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>

     <button
          className="lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-8 h-8 bg-[#0d0f14] border border-white/6 text-slate-400 hover:text-slate-200 transition-colors duration-150 cursor-pointer "
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={14} />
        </button>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}


      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-[270px] h-screen shrink-0
        bg-[#0d0f14] border-r border-white/6
        transition-transform duration-250 ease-in-out
        ${mobileOpen ? "translate-x-0":"-translate-x-full lg:translate-x-0"}
       
      `}
      >
       

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/6">
            {/* Desktop collapse */}
            <div
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
            >
              <PanelLeftIcon />
            </div>

            {/* Mobile close */}
            <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
          >
            <X size={15} />
          </button>

            <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
              PowerAI
            </span>

            <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
              {userData?.plan || "free"}
            </span>

            <button
              // onClick={handleCreateConversation}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer"
              onClick={() => dispatch(setSelectConversation(null))}
            >
              <PenSquare size={14} />
            </button>
          </div>

          {/* New Chat */}
          <div className="px-4 pt-4 pb-1">
            <button
              onClick={() => {dispatch(setSelectConversation(null));setMobileOpen(false)}}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
            >
              <Plus size={15} />
              New Chat
            </button>
          </div>

          {conversations.length == 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No recent conversations
            </div>
          ) : (
            <p className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              Recent
            </p>
          )}

          {/* Section label */}

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {conversations.map((chat, idx) => {
              const isActive = selectedConversation?._id === chat?._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectConversation(chat)}
                  className={`flex items-center gap-2.5 cursor-pointer mb-0.5 px-3 py-2.5 rounded-[10px] border transition-colors duration-150
                ${
                  isActive
                    ? "bg-indigo-500/10 border-indigo-500/18"
                    : "bg-transparent border-transparent"
                }`}
                >
                  <div
                    className={`flex items-center justify-center shrink-0 w-7 h-7 rounded-lg transition-colors duration-150
                ${isActive ? "bg-indigo-500/15 text-indigo-400" : "bg-white/5 text-slate-500"}`}
                  >
                    <MessageSquare size={13} />
                  </div>
                  <span
                    className={`text-[13px] font-medium truncate ${isActive ? "text-slate-100" : "text-slate-300"}`}
                  >
                    {chat.title || "New Chat"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="mx-2.5 h-px bg-white/6" />

          {/* Footer */}
          <div className="px-3.5 py-3.5">
            {userData ? (
              <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors duration-150">
                <div className="relative shrink-0">
                  {!userData?.avatar || imageError ? (
                    <div className="w-9 h-9 rounded-[10px] bg-white/6 flex items-center justify-center">
                      <User size={15} className="text-slate-400" />
                    </div>
                  ) : (
                    <img
                      src={userData?.avatar}
                      alt={userData?.name}
                      className="w-9 h-9 rounded-[10px] object-cover border-2 border-indigo-500/25"
                      onError={() => setImageError(true)}
                    />
                  )}
                  <span className="absolute -bottom-px -right-px w-[9px] h-[9px] bg-green-500 rounded-full border-2 border-[#0d0f14] block" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-slate-100 truncate">
                    {userData?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-px">
                    {userData?.plan || "Free Plan"}
                  </p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => setShowBilling(true)}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-yellow-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  >
                    <CoinsIcon size={16} />
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      dispatch(setUserData(null));
                    }}
                    className="flex items-center justify-center w-7 h-7 rounded-[7px] border-none bg-transparent text-slate-600 cursor-pointer hover:bg-white/8 hover:text-slate-400 transition-all duration-150"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-1">
                <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-200 bg-white/5 border border-white/8 rounded-xl py-[11px] cursor-pointer hover:bg-white/8 transition-colors duration-150">
                  Login
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
        <BillingDrawer
          open={showBilling}
          onClose={() => setShowBilling(false)}
        />
    </>
  );
};

export default Sidebar;
