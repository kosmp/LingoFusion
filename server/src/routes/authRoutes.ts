/* eslint-disable @typescript-eslint/no-var-requires */
import {authValidation} from '../utils/validations';
const auth_router = require("express").Router();
const authController = require("../controllers/authController")

auth_router.post("/register", authValidation, authController.registration);

auth_router.post("/login", authValidation, authController.login);

auth_router.post("/logout", authController.logout);

auth_router.get("/refresh", authController.refresh);

module.exports = auth_router;