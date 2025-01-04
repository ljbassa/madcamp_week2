import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../models/usersModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.post("/", async (req, res) => {
  const { name, email } = req.body;
  await createUser(name, email);
  res.json({ message: "User created successfully" });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await updateUser(id, name, email);
  res.json({ message: "User updated successfully" });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await deleteUser(id);
  res.json({ message: "User deleted successfully" });
});

export default router;