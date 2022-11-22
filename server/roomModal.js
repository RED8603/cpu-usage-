import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  messages: Array,
  user: Array,
  id: String,
});

export default mongoose.model("room", roomSchema);
