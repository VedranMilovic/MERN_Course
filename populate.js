import { readFile } from "fs/promises"; // tu uzimamo file
import mongoose from "mongoose"; // oper se konektiramo iz nule na bazu, odvojeno od server.js spajanja
import dotenv from "dotenv";
dotenv.config();

import Job from "./models/JobModel.js";
import User from "./models/UserModel.js";

try {
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({ email: "vedran@gmail.com" }); // dobivanje admin  usera
  // const user = await User.findOne({ email: 'john@gmail.com' });  // dobivanje testnog usera

  const jsonJobs = JSON.parse(
    await readFile(new URL("./utils/mockData.json", import.meta.url))
  ); // dobivanje json liste
  const jobs = jsonJobs.map((job) => {
    return { ...job, createdBy: user._id }; // createdBy points to the user, tak da ga tu postavljamo na našeg usera
  });
  await Job.deleteMany({ createdBy: user._id });
  await Job.create(jobs);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
