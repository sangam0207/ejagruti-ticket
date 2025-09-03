import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.modal.js";
import Ticket from "../models/ticket.model.js";
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE_TIME = "1d";

const _registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({ success: false, message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return { message: "User registered successfully", data: newUser.email };
};

const _loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: "Invalid credentials" });
  }
  const token = generateToken(user);

  return {
    message: "User logged in successfully",
    data: { email: user.email, name: user.name, token },
  };
};

const _userProfile = async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  const resObj = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return { message: "User profile fetched successfully", data: resObj };
};

const _getTicketList = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const tickets = await Ticket.find({ userEmail: email });

  const resObj = tickets.map((ticket) => ({
    ticketId: ticket.ticketId,
    topic: ticket.topic,
    resolution: ticket.resolution,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  }));
  return { message: "User ticket list fetched successfully", data: resObj };
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE_TIME }
  );
};

export { _registerUser, _loginUser, _userProfile,_getTicketList };
