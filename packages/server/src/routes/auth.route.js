const { Router } = require("express");
const { Auth } = require("../controllers");

const router = Router();

router.route("/sign-in").post(Auth.signIn);
router.route("/sign-out").get(Auth.signOut);

module.exports = router;
