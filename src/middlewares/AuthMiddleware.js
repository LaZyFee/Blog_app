import { TokenDecode } from "../utilities/generateToken.js";

export default (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const tokenFromCookie = req.cookies?.token || null;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Token not provided",
    });
  }

  try {
    const decoded = TokenDecode(token);

    if (!decoded || !decoded.userId || !decoded.email) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid token",
      });
    }

    req.headers.email = decoded.email;
    req.headers.user_id = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};
