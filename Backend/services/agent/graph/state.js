import { Annotation } from "@langchain/langgraph"

export const agentState = Annotation.Root({
    prompt: Annotation(),
    aiResponse: Annotation(),
    agentUsed: Annotation(),
    conversationId: Annotation(),
    searchResults: Annotation(),
    images: Annotation(),
    artifact: Annotation(),
    agent:Annotation()
})