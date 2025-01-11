import { TokenDecode } from "../utilities/generateToken.js";

export default (req, res, next) => {
    const token =
        req.headers["authorization"]?.split(" ")[1] || req.cookies["token"];

    if (!token) {
        return res
            .status(401)
            .json({ status: "fail", message: "Token not provided" });
    }

    try {
        const decoded = TokenDecode(token);
        req.headers.email = decoded.email;
        req.headers.user_id = decoded.userId;
        console.log(decoded.email, decoded.userId);
        next();
    } catch (err) {
        res.status(401).json({ status: "fail", message: "Invalid Token" });
    }
};
