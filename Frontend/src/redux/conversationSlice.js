import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "user",
    initialState: {
        conversations:[]
    },
    reducers: {
        setConversations: (state,action) => {
            state.conversations = action.payload
        },
        addConversation: (state, action) => {
            state.conversations.unshift(action.payload)
        }
    }
})

export default conversationSlice.reducer;
export const { setConversations, addConversation } = conversationSlice.actions;