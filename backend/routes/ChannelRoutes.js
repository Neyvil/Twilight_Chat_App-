import { Router } from "express";
import verifyToken from "../middilewares/AuthMiddileware.js";
import {
  createChannel,
  getChannelMessages,
  getUsersChannels,
} from "../controllers/ChannelController.js";
const channelRoutes = Router();

channelRoutes.post("/create-channel", verifyToken, createChannel);
channelRoutes.get("/get-user-channels", verifyToken, getUsersChannels);
channelRoutes.get("/get-channel-messages/:channelId", verifyToken,getChannelMessages)

export default channelRoutes;
