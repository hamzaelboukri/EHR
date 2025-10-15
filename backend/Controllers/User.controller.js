
import User from "../Models/User.model.js";
import { generateTokens } from "../Utils/tokenUtils.js";

class UserController {
   
    static async register(req, res) {
        try {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists with this email"
                });
            }

            const user = new User({
                firstName,
                lastName,
                email,
                password
            });

            await user.save();

            // Generate tokens
            const tokens = generateTokens({ userId: user._id, email: user.email });

            // Save refresh token to user
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    },
                    ...tokens
                }
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            // Generate tokens
            const tokens = generateTokens({ 
                userId: user._id, 
                email: user.email,
                role: user.role 
            });

            // Save refresh token to user
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    },
                    ...tokens
                }
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    }
}

export default UserController;