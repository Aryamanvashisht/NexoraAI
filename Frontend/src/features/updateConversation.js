import api from "../../utils/axios.js"

export const updateConversation = async (payload) => {
    try {
        const { data } = await api.put("/chat/update-conversation",payload);
        return data;
    } catch (error) {
        console.log(error);
        return []
    }
}