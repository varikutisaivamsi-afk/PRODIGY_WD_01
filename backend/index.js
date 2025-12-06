const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "mysecretjwtkey123";

// ----------------- Mongoose Setup -----------------
mongoose.connect("mongodb+srv://sivamani:A12345678b@cluster0.mneupzs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// ----------------- User Schema ---------------------
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "user"], default: "user" }
});

const User = mongoose.model("User", UserSchema);

// ----------------- Register -------------------------
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({ message: "User registered", user });
  } catch (error) {
    res.json({ error: "Email already exists" });
  }
});

// ----------------- Login ----------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
});

// ----------------- Protected Route --------------------
app.get("/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (e) {
    return res.json({ error: "Invalid token" });
  }
});

// -------------------------------------------------------
app.listen(4000, () => console.log("Server running on port 4000"));
