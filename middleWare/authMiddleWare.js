const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../privates");

const authenticateUser = (req, res, next) => {
  let token = req.header("Authorization");
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }
  token = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId: decoded.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;
