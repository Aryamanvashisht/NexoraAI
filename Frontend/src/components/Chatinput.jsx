import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sendMessage from "../features/sendMessage.js";
import { addMessage, setArtifact } from "../redux/messageSlice.js";
import { createConversation } from "../features/createConversation.js";
import { addConversation, setConversationTitle, setSelectedConversation } from "../redux/conversationSlice.js";
import { updateConversation } from "../features/updateConversation.js";
import { AGENTS } from "../../utils/allagents.js";

const Chatinput = () => {
  const [value, setValue] = useState("");
  const[selectedAgent,setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    
    let conversation = selectedConversation
    if (!conversation) {
      const conv = await createConversation();
      dispatch(setSelectedConversation(conv));
      dispatch(addConversation(conv))
      conversation = conv;
    } 

    if (conversation.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConversationTitle({title:value.slice(0,20), conversationId:conversation._id}))
    }
    
      const payload = {
        prompt: value.trim(),
        conversationId: conversation?._id,
        agent:selectedAgent.toLowerCase()
      };
      dispatch(addMessage({ role: "user", content: value.trim() }));
      const data = await sendMessage(payload);
      dispatch(setArtifact(data?.artifact || []))
      dispatch(addMessage({ role: "assistant", content:data?.answer, images:data?.images}));
    setValue("")
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/6 bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/3 border border-white/7 rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {
            AGENTS.map(agent => {
              const isActive = selectedAgent === agent.label
              const Icon = agent.icon
              return (
                <div
                  onClick={() => setSelectedAgent(agent.label)}
                  className={`shrink-0 cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all ${isActive ? "bg-linear-to-r from-indigo-500 to-violet-600 text-white border-transparent shadown-[0_1px_8px_rgba(99,102,241,.35)]" : "bg-white/3 text-slate-400 border-white/6 hover:bg-white/7"}`}
                >
                  <Icon
                    size={14}
                    className={`${isActive ? "text-white" : "text-slate-500"}`}
                  />
                  {agent.label}
                </div>
              );
            })
          }
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Anything..."
          rows={3}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200
placeholder:text-slate-600 leading-relaxed scrollbar-none [&::-webkit-scrollbar]:hidden
disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Paperclip size={17} />
            </button>
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 border border-transparent hover:border-white/6 transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={17} />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!value}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white" : "bg-white/5 text-slate-600 cursor-not-allowed"} `}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatinput;
