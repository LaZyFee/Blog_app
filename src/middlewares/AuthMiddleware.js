import { TokenDecode } from "../utilities/generateToken.js";

export default (req, res, next) => {
    let token = req.headers["token"];
    if (!token) {
        token = req.cookies["token"]
    }
    let decoded = TokenDecode(token);

    if (decoded === null) {
        res.status(401).json({ status: "fail", message: "Unauthorized" });
    } else {
        let email = decoded.email;
        let user_id = decoded.userId;
        req.headers.email = email;
        req.headers.user_id = user_id;
        next();
    }
};