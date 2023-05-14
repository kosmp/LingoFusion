import {updateProfileUsernameValidation, updateProfileEnglishLvlValidation} from '../utils/validations';
const profile_router = require("express").Router();
const profileController = require("../controllers/profileController");
const authCheckProfile = require("../middlewares/authMiddleware");

profile_router.get("/:userId/profile", authCheckProfile, profileController.getUserProfile);
profile_router.put("/:userId/profile/username", authCheckProfile, updateProfileUsernameValidation, profileController.updateUsernameInProfile);
profile_router.put("/:userId/profile/englishLvl", authCheckProfile, updateProfileEnglishLvlValidation, profileController.updateEnglishLvlInProfile);

module.exports = profile_router;