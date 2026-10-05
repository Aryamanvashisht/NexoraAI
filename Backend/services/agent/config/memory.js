import redis from "../../../shared/redis/redis.js"
import { getMessages } from "../agents/utils/getMessages.js"

export const getMemory = async (conversationId) => {
    try {
        const key = `messages-${conversationId}`
        const cacheMessages = await redis.get(key)
        if (cacheMessages) {
            return JSON.parse(cacheMessages)
        }
        const messages = await getMessages(conversationId)
        await redis.set(key,JSON.stringify(messages),"EX",24*60*60)
        return messages
    } catch (error) {
        console.log(`Error in getMemory : ${error}`);
        return []
    }
}

export const addMessage = async (conversationId,role,content) => {
    try {
        const key = `messages-${conversationId}`;
        const rawMessage = await redis.get(key);
        const messages = rawMessage ? JSON.parse(rawMessage) : []
        messages.push({
          role,
          content
        });
        if (messages > 20) {
            messages.shift();
        }
        
        await redis.set(key,JSON.stringify(messages),"EX",24*60*60)
    } catch (error) {
        console.log(`Error in addingMessage : ${error}`);
    }
}