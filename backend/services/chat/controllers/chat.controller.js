import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const conversation = await Conversation.create({ userId: userId });
    res.status(201).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating conversation" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const conversations = await Conversation.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error fetching conversation" });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { conversationId, title } = req.body;
    if (!conversationId || !title) {
      return res
        .status(400)
        .json({ message: "Conversation ID and title are required" });
    }
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { title },
      { returnDocument: true },
    );
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error updating conversation" });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, role, content ,images } = req.body;
    if (!conversationId || !role || !content) {
      return res
        .status(400)
        .json({ message: "conversationId, role, and content are required" });
    }
    const message = await Message.create({ conversationId, role, content,images });
    res.status(201).json(message);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Error saving message" });
  }
};

export const getMessages = async (req, res) => {
  try {
 
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
