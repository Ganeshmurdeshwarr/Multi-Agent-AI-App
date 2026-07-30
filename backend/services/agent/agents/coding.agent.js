import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/LLMModel.js";
import { deductCredits } from "../utils/deductCredits.js";

export const codingAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "coding");

    const intentLLM = await getModel("intent");
    const llm = await getModel("coding");
    const intentRes = await intentLLM.invoke(`

You are an intent classifier.

Return ONLY one of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:

${state.prompt}

`);

    const intent = intentRes.content.trim();

    if (intent === `CODE_GENERATION`) {
      const prompt = `You are PowerAI Coding Agent.

Generate the requested project.

default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested

Rules:

- Modern UI
- Glassmorphism when suitable
- Responsive
- CSS Variables
- Grid/Flexbox
- Smooth Scroll
- Hover Effects
- Subtle Animations
- Professional spacing
- Single page unless user asks otherwise


IMAGES
=========================

Always use real Unsplash images.

Never use placeholders.

Return ONLY valid JSON:

Schema:

{

"files":[
    {
      "name":"index.html",
      "content":"...
    },
    {
      "name":"style.css",
      "content":"...
    },
    {
      "name":"script.js",
      "content":"...
    },

  ]
}

Rules:

-Output must start with {
-Output must end with }
-No markdown.
-No explanation
-No extra text
-No \`\`\`
-Never mention intent

User Request:
${state.prompt}

`;

await deductCredits(state.userId, "coding");
      const res = await llm.invoke(prompt);

      const raw = res.content.trim();

      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");

      if (start === -1 || end === -1) {
        throw new Error("Coding agent did not return JSON");
      }

      const jsonString = cleaned.slice(start, end + 1);

      const data = JSON.parse(jsonString);


      return {
        ...state,
        aiResponse: "Code Generated Successfully",
        artifacts: [
          {
            id: Date.now(),
            type: "Project",
            files: data.files || [],
            title: state.prompt,
          },
        ],
      };
    }

    const res = await llm.invoke(`
  The user's request is:

  ${intent}

  Return Markdown only.
  Never generate project files.

  Use headings like:
    ## Overview
    ## Explanation
    ## Problems
    ## Improvements
    ## Best Practices
    ## Optimized Code(if needed)

  User Request

  ${state.prompt}

    `);

    const data = res.content;
    await deductCredits(state.userId, "coding");

    return {
      ...state,
      aiResponse: data,
      artifacts: [],
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "❌ Failed to generate code",
      artifacts: [],
    };
  }
};
