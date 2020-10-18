const { Router } = require("express");
const { Auth, Group } = require("../controllers");

const router = Router();

router.route("/")
  .get(Auth.requireSignIn, Group.allGroups)
  .post(Auth.requireSignIn, Group.createGroup);

module.exports = router;
