import express from "express";
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
} from "../Controllers/Permissions.controller.js";

const router = express.Router();

router.post("/", createPermission);

router.get("/", getAllPermissions);

router.get("/:id", getPermissionById);

router.put("/:id", updatePermission);

router.delete("/:id", deletePermission);

export default router;
