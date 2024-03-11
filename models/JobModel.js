import mongoose, { Schema } from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

const JobSchema = new mongoose.Schema(
  {
    // properties za database instance. S MongoDb dobijamo IDs
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS), // umjesto [pending, interview, declined], JOB_STATUS je object
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: "my-city",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // dodajemo timestamp
);

export default mongoose.model("Job", JobSchema); // stvaramo collection (table). Job je ime, mongoose pretvorio u Jobs
