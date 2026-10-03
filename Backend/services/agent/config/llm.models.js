import { ChatGroq } from "@langchain/groq"
import {ChatGoogleGenerativeAI} from "@langchain/google-genai"

const groqllm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
});

const geminillm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  maxRetries: 2,
});

export const getModel = (agent) => {
        switch (agent) {
            case "chat":
                return groqllm;
            case "search":
                return groqllm;
            case "coding":
                return geminillm;

            default:
                return groqllm;
        }
}