/* eslint-disable @typescript-eslint/no-var-requires */
const auth_router = require("express").Router();
const authController = require("../controllers/authController")
const {check} = require("express-validator");

auth_router.post("/register", [
    check('login', "Login can't be empty.").notEmpty(),
    check('login', "Login must be bigger than 4 and less than 12").isLength({min: 4, max: 12}),
    check('password', "Password must be bigger than 4 symbols and less than 10").isLength({min: 4, max: 20})
], authController.registration);

auth_router.post("/login", authController.login);

auth_router.post("/logout", authController.logout);

auth_router.get("/refresh", authController.refresh);

module.exports = auth_router;