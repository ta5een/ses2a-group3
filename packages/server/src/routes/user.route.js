const { Router } = require("express");
const { Auth, User } = require("../controllers");

const router = Router();

router.route("/").get(User.allUsers).post(User.createUser);

router.param("id", User.userWithId);

router
  .route("/:id")
  .get(Auth.requireSignIn, User.readUser)
  .put(Auth.requireSignIn, Auth.hasAuthorization, User.updateUser)
  .delete(Auth.requireSignIn, Auth.hasAuthorization, User.deleteUser);

module.exports = router;
