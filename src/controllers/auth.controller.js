import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "15m",
    });
    return res.status(200).send({ message: "Login successful", user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res
        .status(400)
        .send({ message: "Full name, email and password are required" });

    if (password.length < 6)
      return res
        .status(400)
        .send({ message: "Password must be at least 6 characters" });

    if (!email.includes("@"))
      return res.status(400).send({ message: "Email is not valid" });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).send({ message: "User already exist" });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = await User.create({ fullName, email, password: hash });
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "15m",
    });
    return res
      .status(200)
      .send({ message: "Registration successful", user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const userDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.status(200).send({ message: "User details", user });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
