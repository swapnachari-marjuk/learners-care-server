const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.send({ message: "unauthorized access!" });
  }

  const token = bearer.split(" ")[1];
  if (!token) {
    return res.send({ message: "something went wrong!" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.send({ error: "Invalid or expired token" });
    }

    req.user = decoded;

    next();
  });
};

module.exports = { verifyJWT };
