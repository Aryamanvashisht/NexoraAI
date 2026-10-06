import { useEffect } from "react"
import Chatinput from "./Chatinput"
import Messagelist from "./Messagelist"
import Navbar from "./Navbar"
import { useDispatch, useSelector } from "react-redux"
import getMessages from "../features/getMessages.js"
import { setMessages } from "../redux/messageSlice.js"

const Chatarea = () => {
  const {selectedConversation} = useSelector(state=>state.conversation)
  const dispatch = useDispatch()
  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation) {
        if (selectedConversation.title === "New Chat") return;
        const data = await getMessages(selectedConversation?._id);
        dispatch(setMessages(data));
      }
    };
    getMsg();
  }, [selectedConversation?._id]);

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <Navbar />
      <Messagelist />
      <Chatinput/>
    </div>
  )
}

export default Chatarea