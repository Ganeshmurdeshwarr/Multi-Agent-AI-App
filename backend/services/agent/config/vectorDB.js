import "dotenv/config"
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./embbeding.js";

export const vectorStore = async (collectionName, docs) => {

  try {

   return await QdrantVectorStore.fromDocuments(docs ,embeddings, {
  url: process.env.QDRANT_URL,
  collectionName 
  })
} catch (error) {
    console.log(error)
  }
  

}
