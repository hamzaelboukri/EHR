import Patient from "../Models/Patient.model.js";
import User from "../Models/User.model.js";

class PatientController {
  // ➕ Create Patient
  async create(req, res) {
    try {
      const { userId, firstName, lastName, birthDate, gender, contact, allergies, medicalHistory, insurance } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const patient = new Patient({
        userId,
        firstName,
        lastName,
        birthDate,
        gender,
        contact,
        allergies,
        medicalHistory,
        insurance
      });

      await patient.save();
      return res.status(201).json({ message: "Patient created successfully", patient });
    } catch (error) {
      return res.status(500).json({ message: "Error creating patient", error: error.message });
    }
  }

  // 📋 Get all patients (with pagination)
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const total = await Patient.countDocuments();
      const patients = await Patient.find()
        .populate("userId", "firstName lastName email")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      return res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        count: patients.length,
        patients
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching patients", error: error.message });
    }
  }

  // 🔍 Get patient by ID
  async getById(req, res) {
    try {
      const patient = await Patient.findById(req.params.id).populate("userId", "firstName lastName email");
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      return res.status(200).json(patient);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching patient", error: error.message });
    }
  }

  // ✏️ Update patient
  async update(req, res) {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      return res.status(200).json({ message: "Patient updated successfully", patient });
    } catch (error) {
      return res.status(500).json({ message: "Error updating patient", error: error.message });
    }
  }

  // ❌ Delete patient
  async delete(req, res) {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) return res.status(404).json({ message: "Patient not found" });
      return res.status(200).json({ message: "Patient deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting patient", error: error.message });
    }
  }

  // 🔎 Search patients (with pagination)
  async search(req, res) {
    try {
      const { q, page = 1, limit = 10 } = req.query;
      const regex = new RegExp(q, "i");
      const skip = (page - 1) * limit;

      const filter = {
        $or: [
          { firstName: regex },
          { lastName: regex },
          { "contact.email": regex }
        ]
      };

      const total = await Patient.countDocuments(filter);
      const patients = await Patient.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "firstName lastName email");

      return res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        count: patients.length,
        patients
      });
    } catch (error) {
      return res.status(500).json({ message: "Error searching patients", error: error.message });
    }
  }
}

export default new PatientController();
