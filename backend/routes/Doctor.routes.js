import express from "express";
import DoctorController from "../Controllers/Doctor.controller.js";

const router = express.Router();

router.post("/", DoctorController.create);
router.get("/", DoctorController.getAll);
router.get("/:id", DoctorController.getById);
router.put("/:id", DoctorController.update);
router.delete("/:id", DoctorController.delete);

export default router;
