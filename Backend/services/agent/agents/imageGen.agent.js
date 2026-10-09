import axios from "axios";
import { getModel } from "../config/llm.models.js";
import { uploadToS3 } from "./utils/uploadToS3.js";
import { getFromS3 } from "./utils/getFromS3.js";

export const imageGenAgent = async (state) => {
  try {
    const llm = getModel("image");
    const res = await llm.invoke(`
You are an expert AI image prompt engineer.
Convert the user request into ONE detailed, photorealistic image prompt
(cinematic lighting, sharp focus, depth of field, 8K).
Return ONLY the prompt in a single paragraph.
No tips, no explanation, no markdown, no code blocks.

User Request: ${state.prompt}
`);

    const rawContent =
      typeof res.content === "string"
        ? res.content
        : JSON.stringify(res.content);

    const prompt = rawContent
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 400);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?width=1024&height=1024&nologo=true`;

    const imageRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 90000,
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const contentType = imageRes.headers["content-type"] || "";
    if (!contentType.startsWith("image/")) {
      throw new Error(
        "Not an image. Content-Type: " +
          contentType +
          " | Body: " +
          Buffer.from(imageRes.data).toString().slice(0, 200),
      );
    }

    const buffer = Buffer.from(imageRes.data);

    const ext = contentType.includes("jpeg") ? "jpg" : "png";
    const fileName = `image-${Date.now()}.${ext}`;
    await uploadToS3(fileName, buffer, contentType);
  
    const downloadUrl = await getFromS3(fileName, 24*60);

    return {
      aiResponse: `# 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 24 hours.`,
    };
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    console.error("Status:", error.response?.status);
    console.error(
      "Response data:",
      error.response?.data
        ? Buffer.from(error.response.data).toString().slice(0, 300)
        : "none",
    );
    return { aiResponse: "❌ Failed to generate the image" };
  }
};
