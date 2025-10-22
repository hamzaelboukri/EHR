import Patient from "../Models/Patient.model.js";
import User from "../Models/User.model.js";

class PatientController {
  
  async create(req, res) {
    try {
      const { 
        userId, firstName, lastName, birthDate, gender, contact, allergies, medicalHistory, insurance,
        consentements, preferences // ✅ ajout
      } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const patient = new Patient({
        userId, firstName, lastName, birthDate, gender, contact, allergies, medicalHistory, insurance,
        consentements, preferences
      });

      await patient.save();
      return res.status(201).json({ message: "Patient created successfully", patient });
    } catch (error) {
      return res.status(500).json({ message: "Error creating patient", error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, allergy, insurance } = req.query;
      const skip = (page - 1) * limit;

      const filter = {};
      if (allergy) filter.allergies = { $in: [allergy] };
      if (insurance) filter.insurance = insurance;

      const total = await Patient.countDocuments(filter);
      const patients = await Patient.find(filter)
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

  // 🔎 Search patients (multi-criteria)
  async search(req, res) {
    try {
      const { q, allergy, insurance, page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const filters = [];

      if (q) {
        const regex = new RegExp(q, "i");
        filters.push({
          $or: [
            { firstName: regex },
            { lastName: regex },
            { "contact.email": regex }
          ]
        });
      }

      if (allergy) filters.push({ allergies: { $in: [allergy] } });
      if (insurance) filters.push({ insurance });

      const filter = filters.length ? { $and: filters } : {};

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
