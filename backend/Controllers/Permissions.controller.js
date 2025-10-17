 import Permission from "../Models/Permissions.model.js";

// Create Permission
export const createPermission = async (req, res) => {
  try {
    const { Name, desc } = req.body;
    const newPermission = new Permission({ Name, desc });
    await newPermission.save();
    res.status(201).json({ message: "Permission created successfully", newPermission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Permission
export const updatePermission = async (req, res) => {
  try {
    const updated = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ message: "Permission updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Permission
export const deletePermission = async (req, res) => {
  try {
    const deleted = await Permission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Permission not found" });
    res.status(200).json({ message: "Permission deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
