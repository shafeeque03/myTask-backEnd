import role from "../model/roleModel.js";

export const addRole = async (req, res) => {
  try {
    let { Permissions, name } = req.body;
    let duplicate = await role.findOne({ name: name });
    if (duplicate) {
      return res.status(400).json({ message: "This name is already taken" });
    } else {
      let newRole = new role({
        name: name,
        permission: Permissions,
      });
      await newRole.save();
      res.status(200).json({ message: "New role added" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRole = async (req, res) => {
  try {
    let roles = await role.find({});
    res.status(200).json({ roles });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }
    const result = await role.deleteOne({ _id: roleId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "role not found" });
    }
    res.status(200).json({ message: "Role removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editRole = async (req, res) => {
  try {
    let { roleId, Permissions, name } = req.body;
    const updatedRole = await role.findByIdAndUpdate(
      { _id: roleId },
      { $set: { name, permission: Permissions } },
      { new: true, runValidators: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ message: "Role updated", role: updatedRole });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
