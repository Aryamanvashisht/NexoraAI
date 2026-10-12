import {QdrantVectorStore } from "@langchain/qdrant"
import embeddings from "./embeddings.js";

const vectorStore = async(docs, collectionName) => {
  
 return await QdrantVectorStore.fromDocuments(docs,embeddings, {
  url: process.env.QDRANT_URL,
  collectionName
  });

}

export default vectorStore;