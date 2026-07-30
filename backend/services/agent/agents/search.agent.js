import "dotenv/config";
import { searchTool } from "../config/tavily.js"
import { deductCredits } from "../utils/deductCredits.js";

export const searchAgent = async(state)=>{
    try {
       const result =await searchTool.invoke({
        query:state.prompt
       })

           await deductCredits(state.userId, "search")

       return {
        ...state,
        searchResults:result,
        images:result.images
       }
    } catch (error) {
         return {
        ...state,
        searchResults:[],
        images:[]
       }
    }
}