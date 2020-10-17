const { Router } = require("express");
const { Auth, Interest } = require("../controllers");

const router = Router();

router.route("/").get(Interest.allInterests).post(Interest.createInterest);

router
  .route("/:id")
  .get(Interest.readInterest)
  .post(Auth.requireSignIn, Interest.updateInterest)
  .delete(Auth.requireSignIn, Interest.deleteInterest);

module.exports = router;
