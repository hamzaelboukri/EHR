const Appointment = require("../Models/Appointment");
const Doctor = require("../Models/Doctor.model");
const User = require("../Models/User.model");

class AppointmentController {
  // 🟢 Create appointment with conflict check
  static async create(req, res) {
    try {
      const { doctorId, patientId, AppointmentDate, Status = "scheduled" } = req.body;

      // 1️⃣ Check conflict
      const conflict = await Appointment.findOne({ doctorId, AppointmentDate });
      if (conflict) return res.status(409).json({ message: "Time slot already booked!" });

      // 2️⃣ Create appointment
      const newAppointment = new Appointment({ doctorId, patientId, AppointmentDate, Status });
      await newAppointment.save();

      res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🟡 Get all appointments with pagination
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Appointment.countDocuments();
      const appointments = await Appointment.find()
        .sort({ AppointmentDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("doctorId patientId", "firstName lastName email");

      res.status(200).json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        appointments,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🔍 Get single appointment by ID
  static async getOne(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id).populate("doctorId patientId", "firstName lastName email");
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
      res.status(200).json(appointment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🟢 Update appointment
  static async update(req, res) {
    try {
      const { doctorId, AppointmentDate } = req.body;

      // Optional: check conflict if changing doctor or date
      if (doctorId && AppointmentDate) {
        const conflict = await Appointment.findOne({
          doctorId,
          AppointmentDate,
          _id: { $ne: req.params.id }, // ignore current appointment
        });
        if (conflict) return res.status(409).json({ message: "Time slot already booked!" });
      }

      const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: "Appointment not found" });
      res.status(200).json({ message: "Appointment updated", updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🔴 Delete appointment
  static async delete(req, res) {
    try {
      const deleted = await Appointment.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Appointment not found" });
      res.status(200).json({ message: "Appointment deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 📅 Get availability of doctor for a specific day
  static async getAvailability(req, res) {
    try {
      const { doctorId, date } = req.query;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ message: "Doctor not found" });

      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      const appointments = await Appointment.find({
        doctorId,
        AppointmentDate: { $gte: start, $lt: end },
      });

      const workingHours = doctor.workingHours; // ex: ["09:00", "10:00", "11:00"]
      const bookedHours = appointments.map(a => a.AppointmentDate.toISOString().slice(11,16));
      const available = workingHours.filter(hour => !bookedHours.includes(hour));

      res.status(200).json({ available });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = AppointmentController;
