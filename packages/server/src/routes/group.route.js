const { Router } = require("express");
const { Auth, Group, User } = require("../controllers");

const router = Router();

router.route("/").get(Auth.requireSignIn, Group.allGroups);

router
  .route("/by/:userId")
  .get(Auth.requireSignIn, Auth.hasAuthorization, Group.allGroupsByModerator)
  .post(
    Auth.requireSignIn,
    Auth.hasAuthorization,
    User.isAdmin,
    Group.createGroup
  );

module.exports = router;
