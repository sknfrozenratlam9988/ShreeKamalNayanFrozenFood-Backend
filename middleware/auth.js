import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {  
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};
