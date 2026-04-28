import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET not defined in environment variables");
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

const formatUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const registerUser = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return response.status(400).json({
        message: "Name, email, and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return response.status(400).json({
        message: "A user with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"
    });

    const token = signToken(user);

    response.status(201).json({
      message: "Registration successful.",
      token,
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email?.trim() || !password?.trim()) {
      return response.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return response.status(401).json({
        message: "Invalid email or password."
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = signToken(user);

    response.json({
      message: "Login successful.",
      token,
      user: formatUser(user)
    });
  } catch (error) {
    next(error);
  }
};
