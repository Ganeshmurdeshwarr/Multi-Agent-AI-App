import axios from "axios";
import { uploadS3 } from "../utils/uploadToS3.js";
import { getModel } from "../config/LLMModel.js";
import { getFormS3 } from "../utils/getFormS3.js";

export const imageAgent = async (state) => {


    try {

        
  const llm = await getModel("image");
  const res = await llm.invoke(`
        
You are an elite image prompt engineer.

convert the user request into a highly detailed image generation prompt

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- Beautiful color palette
- Sharp focus
- 8k quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return Only the image prompt

User Request

${state.prompt}

        `);

  const prompt = res.content.trim();
  const imageUrl = `http://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
  const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(imageRes.data);
  const filename = `image${Date.now()}.png`;
  await uploadS3(filename, buffer, "image/png");
  const downloadUrl = await getFormS3(filename, 10*60);
  return {
    ...state,
    aiResponse:`![Generated Image](${downloadUrl})

  📩 [Download Image](${downloadUrl})

  ⌛ Link expires in 10 minutes.
    `,
  }
        
    } catch (error) {
        console.log(error)
        return{
            ...state,
            aiResponse:"❌ Failed to generate image"
        }
    }

};
