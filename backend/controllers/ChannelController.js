import mongoose from "mongoose";
import asyncHandler from "../middilewares/asyncHandler.js";
import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";

export const createChannel = asyncHandler(async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.user._id;

    const admin = await User.findById(userId);

    if (!admin) {
      return res.status(400).send("Admin User not found.");
    }

    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).send("some members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
});
export const getUsersChannels = asyncHandler(async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({ channel: channels });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
});

export const getChannelMessages = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;
    console.log(channelId)
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        sender: "firstName lastName email _id image color",
      },
    });
    if(!channel){
      return res.status(404).send("Channel not found")
    }

    const messages = channel.messages;

    return res.status(201).json({ messages });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
});
