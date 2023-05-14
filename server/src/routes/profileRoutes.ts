const profile_router = require("express").Router();
const profileController = require("../controllers/profileController");
const authCheckProfile = require("../middlewares/authMiddleware");

profile_router.get("/:userId/profile", authCheckProfile, profileController.getUserProfile);
profile_router.put("/:userId/profile/username", authCheckProfile, profileController.updateUsernameInProfile);
profile_router.put("/:userId/profile/email", authCheckProfile, profileController.updateEmailInProfile);
profile_router.put("/:userId/profile/englishLvl", authCheckProfile, profileController.updateEnglishLvlInProfile);

module.exports = profile_router;