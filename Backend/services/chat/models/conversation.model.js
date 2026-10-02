import { model, Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Conversation = model("Conversation", conversationSchema);
