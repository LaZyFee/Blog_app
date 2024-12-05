import { generateToken } from "../middlewares/generateToken.js";
import { UserModel } from "../models/userModel.js";
import bcrypt from 'bcrypt'

export const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                status: "failed",
                message: "all fields are required"
            })
        }
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload profile picture
        const profilePicPath = req.file ? req.file.path.replace(/\\/g, "/") : "";

        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            profilepic: profilePicPath
        })
        // Generate JWT token
        const token = generateToken(user);

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilepic
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role
            },
            token,
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const LogoutUser = async (req, res) => {
    try {
        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}