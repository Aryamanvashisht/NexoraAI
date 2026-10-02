import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { routerAgent } from "./routerAgent.js";
import { chatAgent } from "../agents/chat.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { codingAgent } from "../agents/coding.agent.js"
import { pdfAgent } from "../agents/pdf.agent.js"
import { pptAgent } from "../agents/ppt.agent.js"
import { imageGenAgent } from "../agents/imageGen.agent.js"
import {VALID_AGENTS} from "../agents/utils/allAgents.js"

const workflow = new StateGraph(agentState)

workflow.addNode("agent-router",routerAgent)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("imageGen",imageGenAgent)

workflow.addEdge("__start__", "agent-router")
workflow.addConditionalEdges(
  "agent-router",
  (state) =>
    VALID_AGENTS.includes(state.agentUsed) ? state.agentUsed : "chat",
    Object.fromEntries(VALID_AGENTS.map(a=>[a,a]))
);

workflow.addEdge("search", "chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("imageGen", "__end__")

export const graph = workflow.compile()