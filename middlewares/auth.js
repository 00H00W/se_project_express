const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHENTICATED_ERROR } = require("../utils/errors");

module.exports = (req, res, next) => {
  console.log("Test");
  const { authorization } = req.headers;

  // error catch missing authorization
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHENTICATED_ERROR)
      .send({ message: "Authorization required." });
  }

  // get the payload
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHENTICATED_ERROR)
      .send({ message: "Authorization required" });
  }

  // pass the payload to further requests
  req.user = payload;
  next();
  return undefined; // required to make the linter happy
};
