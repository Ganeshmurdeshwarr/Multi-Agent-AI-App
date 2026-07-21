import express from 'express';
import { createConversation, getConversation, getMessages, saveMessage, updateConversation } from '../controllers/chat.controller.js';
 const router = express.Router();

 router.get("/create-conversation", createConversation)
 router.get("/get-conversations", getConversation)
 router.get("/get-messages/:conversationId", getMessages)
 router.post("/save-message", saveMessage)
 router.post("/update-conversation", updateConversation)


 export default router;