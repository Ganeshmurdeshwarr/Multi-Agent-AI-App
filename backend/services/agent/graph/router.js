import { getModel } from "../config/LLMModel.js";

export const router = async (state) => {

   if(state.agent && state.agent !== "auto"){
   return  {
    ...state,
    agent:state.agent
}
   }

  const llm = await getModel("router");
  const prompt = `You are an agent router.
   
   Available agents:

- chat
- search
- coding
- pdf
- ppt 
- images

Rules:

chat:
General conversation,
explanation,
learning,
question.

search:
 Current events,
 latest information,
 news,
 recent developments,
 internet lookup.

 coding:
 Generate code,
 debug code,
 build projects,
 architecture,
 api design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Question about generate ppts
or ppt context.

image:
Generate image
create image

Return ONLY one word:

chat
search
coding
pdf
ppt
image


User Query:
${state.prompt}
   `;


const response = await llm.invoke(prompt)
return  {
    ...state,
    agent:response.content.trim().toLowerCase()
}
};
