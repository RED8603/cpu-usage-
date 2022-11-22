import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  id: String,
});

export default mongoose.model("user", userSchema);
