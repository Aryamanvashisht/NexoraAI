import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifact:[]
  },
  reducers: {
      setMessages: (state, action) => {
          state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setArtifact: (state, action) => {
     state.artifact = action.payload
    }
  },
});

export default messageSlice.reducer;
export const { setMessages, addMessage, setArtifact } = messageSlice.actions;
