import Role from "../Models/Role.model.js";
import Permission from "../Models/Permissions.model.js";

// Create Role
export const createRole = async (req, res) => {
  try {
    const { Name, Permissions } = req.body; // Permissions = [id1, id2, id3]

    // Vérifier si tous les permissions existent
    const foundPermissions = await Permission.find({ _id: { $in: Permissions } });
    if (foundPermissions.length !== Permissions.length) {
      return res.status(400).json({ message: "Some permissions not found" });
    }

    const role = new Role({ Name, Permissions });
    await role.save();

    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("Permissions");
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("Permissions");
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Role
export const updateRole = async (req, res) => {
  try {
    const { Name, Permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { Name, Permissions },
      { new: true }
    ).populate("Permissions");

    if (!updatedRole) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role updated", updatedRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Role
export const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
