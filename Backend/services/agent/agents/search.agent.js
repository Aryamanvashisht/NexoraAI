import { checkAgentLimit } from "../config/agentRateLimit.js";
import { Searchtool } from "../config/tavily.js";
import { deductCredits } from "./utils/deductCredits.js";

export const searchAgent = async(state) => {
    try {
    await checkAgentLimit(state.userId, "search");
     
     const results = await Searchtool.invoke({
        query:state.prompt
     })
     await deductCredits(state.userId, "search");
     return {
         ...state,
         searchResults: results,
         images:results.images
     }
 } catch (error) {
     console.log(error);
     return {
       ...state,
       searchResults: [],
       images: []
     };
 }
};
