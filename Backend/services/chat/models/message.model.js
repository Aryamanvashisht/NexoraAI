import mongoose, { model, Schema } from "mongoose"

const fileSchema = new Schema(
  {
        name: String,
        content: String,
  }
  , {
  _id:false
})

const artifactSchema = new Schema(
  {
    id: Number,
    type: String,
    title:String,
    files: [fileSchema]
  },
  {
    _id: false,
  },
);

const messageSchema = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
    },
    content: String,
    images: [String],
    artifact: [artifactSchema]
  },
  { timestamps: true },
);


export const Message = model("Message",messageSchema)