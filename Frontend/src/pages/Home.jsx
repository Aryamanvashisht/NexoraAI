import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.js";
import api from "../../utils/axios.js";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {setUserData} from "../redux/userSlice.js"
import { Sidebar } from "../components/Sidebar.jsx";
import Chatarea from "../components/Chatarea.jsx";
import Artifact from "../components/Artifact.jsx";

const Home = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  console.log(userData);

  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/auth/login", { token });
      dispatch(setUserData(data))
    } catch (error) {
      console.log(error);
    }
  };

  const loginGoogle = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    const token = await data?.user?.getIdToken();
    console.log(token);
    handleLogin(token);
  };
  return (
    <div className="h-screen bg-[#0d0f14] text-white flex overflow-hidden">
      <Sidebar />
      <Chatarea />
      <Artifact/>
      {!userData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
          <div className="w-85 bg-[#13151c] border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">
                Welcome to CortexAI
              </h2>
              <p className="text-[13px] text-slate-500">
                Please login to continue using app
              </p>
            </div>
            <button
              className="w-full flex items-center justify-center gap-3 py-2.75 rounded-xl text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 hover:from-indigo-400 hover:to-violet-600 active:from-indigo-600 active:to-violet-800 border border-indigo-500/30 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-150 cursor-pointer"
              onClick={loginGoogle}
            >
              <FcGoogle size={18} className="text-white" />
              Continue With Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
