const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");
const { User } = require("../models");

async function signIn(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(401).json({ message: "No user found with the given email" });
    } else if (!user.authenticate(req.body.password)) {
      res.status(401).json({ message: "Email and password don't match" });
    } else {
      const token = jwt.sign({ _id: user._id }, jwtSecret);
      res.cookie("t", token, { expire: new Date() + 9999 });

      res
        .status(200)
        .json({ token, _id: user._id, name: user.name, email: user.email });
    }
  } catch (error) {
    res.status(400).json({ error, message: "Failed to sign in" });
  }
}

function signOut(_, res) {
  res.clearCookie("t");
  res.status(200).json({ message: "Signed out" });
}

function hasAuthorization(req, res, next) {
  const authorized = req.auth && req.profile && req.profile._id == req.auth._id;
  if (!authorized) {
    res.status(403).json({ message: "User is not authorized" });
  }

  next();
}

const requireSignIn = expressJwt({
  secret: jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256", "RS256"],
});

module.exports = {
  signIn,
  signOut,
  hasAuthorization,
  requireSignIn,
};
