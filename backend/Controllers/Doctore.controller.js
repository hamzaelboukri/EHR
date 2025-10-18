import Doctor from "../Models/Doctor.model.js";
import User from "../Models/User.model.js";

class DoctorController {
  // ➕ Create Doctor
  async create(req, res) {
    try {
      const { userId, specialty, experienceYears, availableDays, workingHours } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const doctor = new Doctor({ userId, specialty, experienceYears, availableDays, workingHours });
      await doctor.save();

      return res.status(201).json({ message: "Doctor created successfully", doctor });
    } catch (error) {
      return res.status(500).json({ message: "Error creating doctor", error: error.message });
    }
  }

  // 📋 Get all doctors (with pagination)
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query; // default: page 1, 10 per page
      const skip = (page - 1) * limit;

      const total = await Doctor.countDocuments();
      const doctors = await Doctor.find()
        .populate("userId", "firstName lastName email")
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      return res.status(200).json({
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        count: doctors.length,
        doctors
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching doctors", error: error.message });
    }
  }

  // 🔍 Get doctor by ID
  async getById(req, res) {
    try {
      const doctor = await Doctor.findById(req.params.id).populate("userId", "firstName lastName email");
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      return res.status(200).json(doctor);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching doctor", error: error.message });
    }
  }

  // ✏️ Update doctor
  async update(req, res) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      return res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
      return res.status(500).json({ message: "Error updating doctor", error: error.message });
    }
  }

  // ❌ Delete doctor
  async delete(req, res) {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });
      return res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting doctor", error: error.message });
    }
  }
}

export default new DoctorController();
