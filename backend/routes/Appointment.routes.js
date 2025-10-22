const express = require("express");
const AppointmentController = require("../Controllers/Appointment.controller");

const router = express.Router();

router.post("/", AppointmentController.create);
router.get("/", AppointmentController.getAll);
router.get("/:id", AppointmentController.getOne);
router.put("/:id", AppointmentController.update);
router.delete("/:id", AppointmentController.delete);
router.get("/availability", AppointmentController.getAvailability);

module.exports = router;
