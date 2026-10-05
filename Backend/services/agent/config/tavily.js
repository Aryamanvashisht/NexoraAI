import { TavilySearch } from "@langchain/tavily";

export const Searchtool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages:true
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});
