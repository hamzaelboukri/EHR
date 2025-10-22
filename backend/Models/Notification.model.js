import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['reminder', 'system', 'password_reset'], 
    required: true
  },
  message: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", NotificationSchema);
  