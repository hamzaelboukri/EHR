const Appointment = require("../Models/Appointment");

class AppointmentController {
  // 🟢 Create appointment
  static async create(req, res) {
    try {
      const { AppointmentDate, Status } = req.body;

      const newAppointment = new Appointment({ AppointmentDate, Status });
      await newAppointment.save();

      res.status(201).json({
        message: "Appointment created successfully",
        appointment: newAppointment,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🟡 Get all appointments (with pagination)
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Appointment.countDocuments();
      const appointments = await Appointment.find()
        .sort({ AppointmentDate: -1 })
        .skip(skip)
        .limit(limit);

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

  // 🟢 Get single appointment by ID
  static async getOne(req, res) {
    try {
      const appointment = await Appointment.findById(req.params.id);
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found" });

      res.status(200).json(appointment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🟠 Update appointment
  static async update(req, res) {
    try {
      const updated = await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Appointment not found" });

      res.status(200).json({ message: "Appointment updated", updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // 🔴 Delete appointment
  static async delete(req, res) {
    try {
      const deleted = await Appointment.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Appointment not found" });

      res.status(200).json({ message: "Appointment deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = AppointmentController;
