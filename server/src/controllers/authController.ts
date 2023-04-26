/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const generateAccessToken = (id: any, login: any) => {
    const payload = {
        id,
        login
    }

    return jwt.sign(payload, secretKey, {expiresIn: "24h"})
}

class authController {
    async registration(req: any, res: any) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({error: errors})
                return;
            }

            // check if user with such login exists
            if (await User.findOneUser({login: req.body.login}))
            {
                res.status(404).json("user exists");
                return;
            }
    
            // generate new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
            // create new user in bd
            const user = new User();
            await user.initialize(req.body.login, hashedPassword)
            
            res.status(200).json(await User.findOneUser({_id: user.get_id()}));
        } catch (err) {
            res.status(500).json({error: err});
        }
    }

    async login(req: any, res: any) {
        try {
            // try to find user with login
            const user = await User.findOneUser({login: req.body.login})
            if (!user) {
                res.status(404).json(`user ${req.body.login} not found`);
                return;
            }

            // checking if the password matches
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                res.status(400).json("wrong password");
                return
            }
            
            const token = generateAccessToken(user._id, user.login);
            res.status(200).json({token}) 
        } catch (err) {
            res.status(500).json({error: err});
        }
    }
}

module.exports = new authController()