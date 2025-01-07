import bcrypt from "bcryptjs";
import asyncHandler from "../middilewares/asyncHandler.js";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlink, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

const signup = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge: maxAge * 1000,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).send("Internal Server Error");
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password are required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with given email is not found." });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res
        .status(400)
        .json({ message: "Password credential is incorrect!" });
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge: maxAge * 1000,
    });

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color,
        image: user.image,
      },
    });
  } catch (error) {
    console.error({ error });
    return res.status(500).send("Internal Server Error");
  }
});

const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res.status(404).send("God Damwit User not found");
    } else {
      return res.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        color: userData.color,
        image: userData.image,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(402).json({ message: "Failed to fetch User data" });
  }
});
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName || !color) {
      return res.status(400).json({
        message: "Please fill all the required fields for Profile Setup",
      });
    }
    const userData = await User.findOneAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      color: userData.color,
      image: userData.image,
    });
  } catch (error) {
    console.error(error);
    return res.status(402).json({ message: "Failed to fetch User data" });
  }
});

const addProfileImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (error) {
    console.error(error);
    return res.status(402).json({ message: "Failed to fetch User data" });
  }
});

const removeProfileImage = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const users = await User.findById(user._id);

    if (!users) {
      return res.status(404).send("User not found.");
    }

    if (users.image) {
      unlinkSync(user.image);
    }
    users.image = null;
    await users.save();

    return res.status(200).json({
      message: "Profile succesfully deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(402).json({ message: "Failed to fetch User data" });
  }
});

const logOut = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
    });

    res.status(200).json({ message: "Logged out Successfully" });
  } catch (error) {
    console.log(error);
  }
});
export {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logOut,
};
