import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    
})


const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.6-flash",
    
})


const openRouter = new ChatOpenRouter({
  model: "meta-llama/llama-3.3-70b-instruct:free",
  temperature:0,
  maxTokens:2500
  
  
});


export const getModel = async(agent)=>{
 
 switch (agent) {
    case "chat":
        return groq;
    case "search":
        return groq;
    case "coding":
        return openRouter;
    case "imageAnalyzer":
        return gemini;
    default:
        return groq;
  }
}