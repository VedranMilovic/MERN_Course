import { StatusCodes } from "http-status-codes";

import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs"; // file system module

export const getCurrentUser = async (req, res) => {
  // šaljemo cookie na front i on ga odmah šalje natrag
  const user = await User.findOne({ _id: req.user.userId }); // underscore jer je mongoID id
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();
  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;

  if (req.file) {
    // ako user mijenja image
    const response = await cloudinary.v2.uploader.upload(req.file.path); // uploadamo sliku, ovo vraća object
    await fs.unlink(req.file.path); // ako smo uspješno uploadali file na cloudinary, brišemo file s lokalnog sistema
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id; // kod prvog uploadanja nema starog public_id
  }
  console.log(newUser);
  const oldUser = await User.findByIdAndUpdate(req.user.userId, newUser); // old instance

  if (req.file && oldUser.avatarPublicId) {
    //ako ima novi file i ako ima old user
    await cloudinary.v2.uploader.destroy(oldUser.avatarPublicId); // tu se briše prošli image
  }
  res.status(StatusCodes.OK).json({ msg: "update user" });
};
