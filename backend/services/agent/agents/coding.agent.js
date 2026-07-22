import { getModel } from "../config/LLMModel.js";

export const codingAgent = async (state) => {
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

const intent = intentRes.content;

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

const res = await llm.invoke(prompt)

const data = JSON.parse(res.content)
return{
  ...state,
  aiResponse:"Code Generated Successfully",
  artifacts:{
    id:Date.now(),
    type:"Project",
    files:data.files || [],
    title:state.prompt
    
  }
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

    `)

    const data = await res.content

    return {
      ...state,
      aiResponse:data,
      artifacts:[]
    }

};
