import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(`userId:${userId}`);
    const conversation = await Conversation.create({
      userId,
    });
    res.status(201).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in creating Conversation:${error}` });
  }
};
export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log(`userId:${userId}`);
    const conversations = await Conversation.find({
      userId,
    }).sort({ updatedAt: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in Fetching Conversations:${error}` });
  }
};
export const updateConversation = async (req, res) => {
  try {
    const {id,title} = req.body
    const conversation = await Conversation.findByIdAndUpdate(id,{
      title
    })
    res.status(200).json(conversation);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in Updating Conversation:${error}` });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content } = req.body;
    const message = await Message.create({
      conversationId,
      role,
      content,
    });
    return res.status(201).json(message);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in Saving message:${error}` });
  }
};
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ updatedAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error in Fetching messages:${error}` });
  }
};
