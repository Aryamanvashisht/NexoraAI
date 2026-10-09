import { getModel } from "../config/llm.models.js";
import { generatePdf } from "./utils/generatePdf.js";
import { uploadToS3 } from "../agents/utils/uploadToS3.js";
import { getFromS3 } from "../agents/utils/getFromS3.js";

export const pdfAgent = async (state) => {
  try {
    const llm = getModel("pdf");
    const prompt = `
You are an expert document writer.

The user wants a document (which will be exported as a PDF).
The word "PDF" only describes the output format. It is NOT the subject.
First identify the actual subject from the user's request, then write the
content about that subject only.

Example: "make a pdf on React.js" -> subject is React.js itself
(components, JSX, props, state, hooks, routing, performance), NOT
"how to generate PDFs in React".

Return ONLY valid JSON. Do NOT return Markdown. Do NOT return explanations.

Structure:

{
  "title": "",
  "subtitle": "",
  "sections": [
    {
      "heading": "",
      "points": []
    }
  ]
}

Rules:
- Generate 4-8 sections.
- Each section should have 3-6 concise bullet points.
- Points must be specific and informative (real concepts, terms, names, behaviors), not vague one-liners.
- Cover the topic broadly: basics, core concepts, practical usage, best practices.
- Never mention PDF generation unless the subject itself is PDF generation.

User request:

${state.prompt}
`;

    const res = await llm.invoke(prompt);
    const raw = res.content.replace(/```json|```/g, "").trim();
    const data = JSON.parse(raw);
    const pdfBuffer = await generatePdf(data);
    const filename = `pdf-${Date.now()}.pdf`;
    await uploadToS3(filename, pdfBuffer, "application/pdf");
    const downloadUrl = await getFromS3(filename, 24 * 60);

    return {
      ...state,
      aiResponse: `# PDF Generated Successfully
    **${data?.title || "Document"}**
📥 [Download Pdf](${downloadUrl})

⏳ Link expires in 24 hours.`,
    };
  } catch (error) {
    console.log(error);
    return {
      ...state,
      aiResponse: "❌ Failed to generate pdf",
    };
  }
};
