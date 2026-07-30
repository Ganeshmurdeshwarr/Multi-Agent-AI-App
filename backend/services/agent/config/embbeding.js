import { GoogleGenerativeAIEmbeddings }from "@langchain/google-genai";
import "dotenv/config"

export const embeddings = new GoogleGenerativeAIEmbeddings({
    model:"gemini-embedding-001"

});