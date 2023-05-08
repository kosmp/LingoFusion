/* eslint-disable @typescript-eslint/no-var-requires */
import {userUpdateValidation} from '../utils/validations';
const user_router = require("express").Router();
const userController = require("../controllers/userController");
const authCheck = require("../middlewares/authMiddleware");

user_router.get("/:userId", authCheck, userController.getUser);
user_router.patch("/:userId", userUpdateValidation, authCheck, userController.patchUserPassword);
user_router.delete("/:userId", authCheck, userController.deleteUser);

module.exports = user_router;