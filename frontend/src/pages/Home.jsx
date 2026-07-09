import React from "react";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post(`/api/auth/login`, { token });
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const token = await result.user.getIdToken();
    await handleLogin(token);
    console.log(token);
  };

  return (
    <div className="h-screen flex bg-[#0d0f14] text-white overflow-hidden">
      {/* <Sidebar />
      <ChatArea />
      <ArtifactPanel /> */}

      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[340px] bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to
              </h2>
              <p className="text-[13px] text-slate-500">
                Please login to continue using the app.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-[11px] rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-200  transition-all duration-150 cursor-pointer"
            >
              <FcGoogle size={15} />
              Continue with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
