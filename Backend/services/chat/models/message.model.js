import mongoose, { model, Schema } from "mongoose"

const messageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Conversation"
    },
    role:{
        type: String,
        enum:["user","assistant"]
    },
    content: String,
    images:[String]
  },
  { timestamps: true },
);


export const Message = model("Message",messageSchema)