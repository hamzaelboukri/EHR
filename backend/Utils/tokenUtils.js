import jwt from "jsonwebtoken";

export const generateTokens = (payload) => {
    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET || 'access-secret-key',
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret-key');
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret-key');
};