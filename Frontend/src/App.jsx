import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../utils/firebase"
import api from "../utils/axios"

const App = () => {

  const handleLogin = async(token) => {
    try {
      const { data } = await api.post("/auth/login", { token })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
 
  const loginGoogle = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data?.user?.getIdToken()
    console.log(token);
    handleLogin(token)
  }

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button className="text-2xl bg-amber-300 px-2 py-2 rounded-xl font-semibold hover:translate-1 cursor-pointer" onClick={loginGoogle}>
        Click to login
      </button>
    </div>
  )
}

export default App