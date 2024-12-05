import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    const token = jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return token;
};