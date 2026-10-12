import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llm.models.js";
import fs from "fs/promises";
import { deductCredits } from "./utils/deductCredits.js";

export const imageAnalyzerAgent = async (state) => {
    try {
      
        if (!state.file?.path) {
            throw new Error("No image file provided");
        }
    const llm = getModel("imageanalyzer");
    const imageBuffer = await fs.readFile(state.file?.path);
    const base64image = imageBuffer.toString("base64");

    const messages = [
      new SystemMessage(
        `
You are NexoraAI Image Analyzer Agent.

Task: Convert the uploaded image into text.

Rules:
- Analyze only the uploaded image.
- Extract all visible text exactly as written, preserving the original order and line breaks.
- For tables, output them as Markdown tables.
- For charts or diagrams, list the labels, values, and legends that are visible. Do not interpret beyond what is shown.
- If part of the image is unclear or unreadable, write [unclear] at that place.
- If the image contains no text, give a short factual description of what is visible.
- Do not add assumptions, opinions, or information that is not in the image.
- Return only the extracted content, with no introduction or closing remarks.
`,
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: state.prompt || "analyze the image",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${state.file.mimetype};base64,${base64image}`,
            },
          },
        ],
      }),
    ];
      
      const response = await llm.invoke(messages)
      await deductCredits(state.userId,"imagegen")
      return {
          ...state,
          aiResponse:response.content
      }
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to analyze image",
    };
    }
    finally {
        fs.unlink(state.file?.path)
    }
};
