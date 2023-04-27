/* eslint-disable @typescript-eslint/no-var-requires */
const auth_router = require("express").Router();
const authController = require("../controllers/authController")
const {check} = require("express-validator");

auth_router.post("/register", [
    check('login', "Login can't be empty.").notEmpty(),
    check('password', "Password must be bigger than 4 symbols and less than 10").isLength({min: 4, max: 10})
], authController.registration);

auth_router.post("/login", authController.login);

auth_router.get("/logout", authController.logout);

auth_router.get("/activate/:link", authController.activate);

auth_router.get("/refresh", authController.refresh);

module.exports = auth_router;