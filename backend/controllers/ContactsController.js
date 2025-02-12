import User from "../models/UserModel.js";
import asyncHandler from "../middilewares/asyncHandler.js";
import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";

const searchContacts = asyncHandler(async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("searchTerm is required");
    }

    const refineSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(refineSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
});

const getContactsForDMList = asyncHandler(async (req, res) => {
  try {
    let userId = req.user._id;

    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
  }
});

const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.user } },
      "firstName lastName _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value:user._id
    }));
    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server error");
  }
});

export { searchContacts, getContactsForDMList, getAllContacts };
