import mongoose from "mongoose";
import bcrypt from "bcryptjs/dist/bcrypt.js";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  firstName: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: false,
  },
  color: {
    type: Number,
    require: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("Users", userSchema);

export default User;
