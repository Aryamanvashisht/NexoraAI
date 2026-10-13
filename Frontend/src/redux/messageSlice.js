import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
    artifact: [],
    isLoading:false
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
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
});

export default messageSlice.reducer;
export const { setMessages, addMessage, setArtifact, setIsLoading } =
  messageSlice.actions;
