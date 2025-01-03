import { db } from "./db.js";

// Create
export const createUser = async (name, email) => {
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  await db.execute(query, [name, email]);
};

// Read
export const getUsers = async () => {
  const [rows] = await db.execute("SELECT * FROM users");
  return rows;
};

// Update
export const updateUser = async (id, name, email) => {
  const query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  await db.execute(query, [name, email, id]);
};

// Delete
export const deleteUser = async (id) => {
  const query = "DELETE FROM users WHERE id = ?";
  await db.execute(query, [id]);
};