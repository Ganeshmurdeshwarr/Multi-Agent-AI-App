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

CRITICAL JSON RULES:

- The response MUST be valid JSON.parse() compatible JSON.
- Escape every double quote inside file content as \"
- Escape every backslash correctly.
- Escape newlines as \n when required.
- Never use unescaped double quotes inside a JSON string.
- Do NOT add trailing commas.
- Do NOT put markdown fences around the JSON.

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
    }

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

      let data;

      try {
   data = JSON.parse(jsonString);

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

} catch (error) {

  console.error("🔥 JSON PARSE FAILED");
  console.error("🔥 ERROR:", error.message);

  const match = error.message.match(/position (\d+)/);

  if (match) {
    const position = Number(match[1]);

    console.error("🔥 ERROR POSITION:", position);

    console.error(
      "🔥 BEFORE:",
      jsonString.slice(Math.max(0, position - 500), position)
    );

    console.error(
      "🔥 AFTER:",
      jsonString.slice(position, position + 500)
    );
  }

  throw error;
}
     
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
    console.error("🔥 CODING AGENT ERROR:", error);
    console.error("🔥 ERROR MESSAGE:", error?.message);
    console.error("🔥 ERROR STACK:", error?.stack);

    return {
      ...state,
      aiResponse: `❌ Failed to generate code: ${error?.message || "Unknown error"}`,
      artifacts: [],
    };
  }
};
