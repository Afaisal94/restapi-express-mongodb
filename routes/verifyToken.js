const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "@SecretKey123";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const verified = jwt.verify(token, SECRET_KEY);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).json({
        status: res.statusCode,
        message: "Invalid Token !",
      });
    }
  } else {
    return res.status(400).json({
      status: res.statusCode,
      message: "Access Denied !",
    });
  }
};

module.exports = verifyToken;
