import {userUpdateValidation} from '../utils/validations';
const user_router = require("express").Router();
const userController = require("../controllers/userController");
const authCheckUser = require("../middlewares/authMiddleware");

user_router.get("/:userId", authCheckUser, userController.getUser);
user_router.patch("/:userId", userUpdateValidation, authCheckUser, userController.patchUserPassword);
user_router.delete("/:userId", authCheckUser, userController.deleteUser);

module.exports = user_router;