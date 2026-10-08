import { getModel } from "../config/llm.models.js";

export const codingAgent = async (state) => {
  try {
    const intentLlm = getModel("intent");
    const openrouterllm = getModel("coding");
    const intentResponse = await intentLlm.invoke(`

You are an intent classifier for a coding AI agent.

Classify the user's request into EXACTLY ONE of these intents:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

Definitions:

CODE_GENERATION:
User wants new code, a website, application, component, project, etc.

CODE_REVIEW:
User provides code and asks for review or feedback.

CODE_EXPLANATION:
User asks what code does or asks for conceptual explanation.

DEBUGGING:
User has broken code, errors, exceptions, or unexpected behavior.

OPTIMIZATION:
User wants existing code made faster, cleaner, or more efficient.

CONVERSION:
User wants code converted from one language/framework to another.

DOCUMENTATION:
User wants documentation, comments, README, API docs, etc.

Return ONLY the intent name.

User Request:
${state.prompt}
`);

    const intent = String(intentResponse.content).trim().replace(/["']/g, "");
    if (intent === "CODE_GENERATION") {
      const prompt = `
        You are NexoraAI coding agent.

        Generate the requested project.

        Default stack:
        - HTML
        - CSS
        - Javascript

        Use React / Next.JS / Vue ONLY if explicitely requested.

        Rules.
        -Responsive
        -Modern UI
        -CSS Variables
        -Flexbox/Grid
        -Smooth Scroll
        -Hover Effects
        -Beautiful Spacing
        -Single Page unless user asks otherwise.

        IMAGES
        ========================

        Always use real Unsplash images.

        Never use placeholders.

        Return only valid JSON.

        Schema.
        {
         "files": [
        {
        "name": "index.html",
        "content": "..."
        },
        {
        "name": "style.css",
        "content": "..."
        },
        {
        "name": "script.js",
        "content": "..."
        }
        ]
        }
        
Rules:

-Output must start with {
-Output must end with }
-No markdown
-No explanation
-No extra text
-No \`\`\`
-Never mention intent

User Request:
${state.prompt}
`;
      const res = await openrouterllm.invoke(prompt);
      const data = JSON.parse(res.content);
      console.log(data);
      return {
        ...state,
        aiResponse: "Code Generated Succesfully.",
        artifact: [
          {
            id: Date.now(),
            type: "Project",
            title:state.prompt,
            files: data.files || [],
          },
        ],
      };
    }

    const res = await openrouterllm.invoke(`
    
        The user's intent is:
        ${intent}

        Return Markdown only.

        Never Generate Project files.

        Use headings like:

        # Overview

        ## Explanation

        ## Problems

        ## Improvements

        ## Best Practices

        ## Optimized Code (if needed)

        User Request:
        ${state.prompt}
        `);

    return {
      ...state,
      aiResponse: res?.content,
      artifact: [],
    };
  } catch (error) {
    console.log(`Error in agent-coding ${error}`);
    return {
      ...state,
    aiResponse: "Something went wrong while processing your request.",
    artifact: [],
    }
  }
};
