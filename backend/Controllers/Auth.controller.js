
import User from "../Models/User.model.js";
import { generateTokens, verifyRefreshToken } from "../Utils/tokenUtils.js";

class AuthController {
    
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required"
                });
            }

            
            const decoded = verifyRefreshToken(refreshToken);

            const user = await User.findOne({ 
                _id: decoded.userId, 
                refreshToken: refreshToken 
            });

            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid refresh token"
                });
            }

            // Generate new tokens
            const tokens = generateTokens({ 
                userId: user._id, 
                email: user.email,
                role: user.role 
            });

            // Update refresh token in database
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: tokens
            });

        } catch (error) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired refresh token"
            });
        }
    }

    // Logout - invalidate refresh token
    static async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    message: "Refresh token is required"
                });
            }

            // Remove refresh token from user
            await User.findOneAndUpdate(
                { refreshToken: refreshToken },
                { $unset: { refreshToken: 1 } }
            );

            return res.status(200).json({
                success: true,
                message: "Logged out successfully"
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

export default AuthController;