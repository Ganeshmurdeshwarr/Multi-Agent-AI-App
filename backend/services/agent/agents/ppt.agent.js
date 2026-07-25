import { getModel } from "../config/LLMModel.js";
import { generatePpt } from "../utils/generatePPT.js";
import { getFormS3 } from "../utils/getFormS3.js";
import { uploadS3 } from "../utils/uploadToS3.js";

export const pptAgent = async (state) => {
  try {
    const llm = await getModel("ppt");
    const prompt = ` Your are an professional presentation designer.

        Return ONLY valid JSON.

       
        Format:

        {
        "title":"",
        "subtitle":"",
        "slides":[
        {
        "title":"",
        "points":[
        "",
        "",
        "",
        "",

        ]
        }
        ]
        }


        Rules:

       - Generate exactly 6 content slides
       - Each slide should have 4-6 concise bullet points.
       - No markdown
       - No explanation
       - No code block
       - Return ONLY JSON.


        Topic: 
        ${state.prompt}`;

    const res = await llm.invoke(prompt);

    const data = JSON.parse(res.content);


    const ppt = await generatePpt(data);
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });
    const filename = `ppt-${Date.now()}.pptx`;
    await uploadS3(
      filename,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    const downloadUrl = await getFormS3(filename, 24 * 60);

    return {
      ...state,
      aiResponse: `# ✅ Presentation Generated Successfully

📊 **${data.title}**

📥 [Download PPT](${downloadUrl})

⏳ Link expires in 10 minutes.
            `,
    };
  } catch (error) {
    console.log(error)
    return {
      ...state,
      aiResponse: `❌ Failed to generate PPT...`,
    };
  }
};
