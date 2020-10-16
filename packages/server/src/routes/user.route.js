const { Router } = require("express");
const { Auth, User } = require("../controllers");

const router = Router();

router.route("/").get(User.allUsers).post(User.createUser);

router
  .route("/:id")
  .get(Auth.requireSignIn, User.readUser)
  .get(Auth.requireSignIn, Auth.hasAuthorization, User.updateUser)
  .delete(Auth.requireSignIn, Auth.hasAuthorization, User.deleteUser);

module.exports = router;
