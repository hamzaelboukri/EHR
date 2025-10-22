import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date },
  gender: { type: String, enum: ["male", "female"] },
  contact: {
    phone: String,
    email: String,
    address: String
  },
  allergies: [String],
  medicalHistory: [{
    title: String,
    description: String,
    date: Date
  }],
  insurance: {
    company: String,
    policyNumber: String
  },
  
  consentements: [{
    type: String
  }],
  preferences: {
    language: { type: String, default: "fr" },
    communication: { type: String, enum: ["email", "phone", "sms"], default: "email" }
  }
}, { timestamps: true });

export default mongoose.model("Patient", PatientSchema);
