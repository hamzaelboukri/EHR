import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }] 
});

export default mongoose.model("Role", RoleSchema);