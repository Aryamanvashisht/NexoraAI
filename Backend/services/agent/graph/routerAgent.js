import { getModel } from "../config/llm.models.js";
import {VALID_AGENTS} from "../agents/utils/allAgents.js"

export const routerAgent = async (state) => {

  if (state.agentUsed && state.agentUsed !== "auto" && VALID_AGENTS.includes(state.agentUsed)) {
    return {
      ...state,
      agentUsed: state.agentUsed,
    };
  }

  const llm = getModel("router");
  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- imagegen

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

imagegen:
Generate or edit images.

Return ONLY one word:

chat
search
coding
pdf
ppt
imagegen

User Prompt:
${state.prompt}
`;

    const response = await llm.invoke(prompt)
    console.log(response);
return {
  ...state,
  agentUsed:response.content.trim().toLowerCase()
};
};
