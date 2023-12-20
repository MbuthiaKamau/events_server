import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    category:{
      type: String,
      required: true,
    },
    status:{
      type: String,
      default: "pending",
    },
    date: {
      type:Date,
      required:true,
    },
    time: {
      type: String,
      required:true,
    },
    location: String,
    venue: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
