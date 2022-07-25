import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    socialId: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: "String",
      required: true,
      default:
        "https://res.cloudinary.com/do5uwkdmd/image/upload/v1658747264/default_Profile_Pic_ns2k3w.jpg",
    },
    socialProfile: {
      type: String,
    },
    about: String,
    worksAt: String,
    language: String,
    country: String,
    followers: [],
    following: [],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
