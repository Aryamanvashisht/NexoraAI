import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../utils/firebase"

const App = () => {
 
  const loginGoogle = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    console.log(data);
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