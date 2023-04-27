/* eslint-disable @typescript-eslint/no-var-requires */
const user_router = require("express").Router();
const userController = require("../controllers/userController")

user_router.get("/users", userController.getUsers);

user_router.get("/:userId", userController.getUser);

user_router.put("/:userId", userController.putUser);

user_router.delete("/:userId", userController.deleteUser);

module.exports = user_router;