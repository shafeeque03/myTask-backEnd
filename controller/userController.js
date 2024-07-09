import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import roleModel from "../model/roleModel.js";

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, roles } =
      req.body.userData;
    const roleDocs = await roleModel.find({ _id: { $in: roles } });
    const roleIds = roleDocs.map((role) => role._id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      roles: roleIds,
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error registering user", error });
  }
};

export const getUser = async (req, res) => {
  try {
    let users = await userModel.find({}).populate("roles", "name");
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const result = await userModel.deleteOne({ _id: userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User removed from DB" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { firstName, lastName, email, phone, password, roles } =
      req.body.userData;
    const roleDocs = await roleModel.find({ _id: { $in: roles } });
    const roleIds = roleDocs.map((role) => role._id);
    const editUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { firstName, lastName, email, phone, roles: roleIds } },
      { new: true, runValidators: true }
    );
    if (!editUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { password: hashedPassword } }
      );
    }
    res.status(200).json({ message: "User updated", user: editUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).populate("roles");
    // console.log(user, "hey user");
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      const token = jwt.sign(
        { name: user.name, email: user.email, id: user._id, role: "user" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({ user, token, message: `Welome ${user.name}` });
    } else {
      return res.status(403).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
