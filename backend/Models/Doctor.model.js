import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialty: String,
  experienceYears: Number,
  availableDays: [String],
  workingHours: {
    start: String, 
    end: String    
  }
}, { timestamps: true });

export default mongoose.model("Doctor", DoctorSchema);
