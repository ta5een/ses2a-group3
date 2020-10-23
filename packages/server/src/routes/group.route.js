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

router
  .route("/:groupId")
  .get(Group.readGroup)
  .put(Auth.requireSignIn, Group.isModerator, Group.updateGroup)
  .delete(Auth.requireSignIn, Group.isModerator, Group.deleteGroup);

router.param("groupId", Group.groupWithId);
router.param("userId", User.userWithId);

module.exports = router;
