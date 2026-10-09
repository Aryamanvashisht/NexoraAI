import { getModel } from "../config/llm.models.js";
import { uploadToS3 } from "../agents/utils/uploadToS3.js";
import { getFromS3 } from "../agents/utils/getFromS3.js";
import {generatePpt} from "./utils/generatePpt.js"

export const pptAgent = async (state) => {
  try {
    const llm = getModel("ppt");
    const prompt = `
You are a professional presentation designer.

The user wants a presentation (which will be exported as a PPT).
The words "PPT", "presentation" or "slides" only describe the output format.
They are NOT the subject. First identify the actual subject from the user's
request, then write the content about that subject only.

Example: "make a ppt on React.js" -> subject is React.js itself
(components, JSX, props, state, hooks, routing), NOT "how to create
presentations in React".

Return ONLY valid JSON. No markdown. No code block. No explanation.

Format:
{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": []
    }
  ]
}

Rules:
- Generate exactly 6 content slides.
- Each slide must have 4-6 bullet points.
- Each point must be short and punchy: maximum 12 words, one idea per point.
- Slide titles must be short (2-5 words) and specific.
- Flow of slides: introduction/overview, core concepts, key features,
  practical usage or examples, best practices, summary/key takeaways.
- Points must be specific and informative (real concepts, names, terms),
  not vague filler.
- Do not repeat the same point across slides.
- Write in the same language as the user's request.
- Never mention PPT or presentation creation unless that is the subject itself.

User request:

${state.prompt}
`;

    const res = await llm.invoke(prompt);
    const raw = res.content.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);
    const ppt = await generatePpt(data);
    const pptBuffer = await ppt.write({
        outputType:"nodebuffer"
    })
    const filename = `ppt-${Date.now()}.pptx`;
    await uploadToS3(
      filename,
      pptBuffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFromS3(filename, 24 * 60);

    return {
      ...state,
      aiResponse: `✅ **${data?.title || "Presentation"}**

📥 [Download PPT](${downloadUrl})

⏳ Link expires in 24 hours.`,
    };
  } catch (error) {
    console.log(`Error generating ppt ${error}`);
    return {
      ...state,
      aiResponse: "❌ Failed to generate ppt",
    };
  }
};
