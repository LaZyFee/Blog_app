import { TokenDecode } from "../utilities/generateToken.js";

export default (req, res, next) => {
    console.log(req.headers);
    const token =
        req.headers["authorization"]?.split(" ")[1] || req.cookies["token"];

    console.log("Authorization Header:", req.headers["authorization"]);
    console.log("Cookie Token:", req.cookies?.token);

    if (!token) {
        return res
            .status(401)
            .json({ status: "fail", message: "Token not provided" });
    }

    try {
        const decoded = TokenDecode(token);
        console.log(decoded);
        req.headers.email = decoded.email;
        req.headers.user_id = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ status: "fail", message: "Invalid Token" });
    }
};
