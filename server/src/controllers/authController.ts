/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
import {Request, Response, NextFunction} from 'express';
const {validationResult} = require('express-validator');
const userService = require('../service/userService')

class authController {
    async registration(req: Request, res: Response, next: NextFunction) {
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
    
            const {login, password} = req.body;
    
            const userData = await userService.registration(login, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true});
            return res.status(200).json(userData);
        } catch (e) {
            res.status(500).json({error: e});
            next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            // // try to find user with login
            // const user = await User.findOneUser({login: req.body.login})
            // if (!user) {
            //     res.status(404).json(`user ${req.body.login} not found`);
            //     return;
            // }

            // // checking if the password matches
            // const validPassword = await bcrypt.compare(req.body.password, user.password)
            // if (!validPassword) {
            //     res.status(400).json("wrong password");
            //     return
            // }
            
            // const token = generateAccessToken(user._id, user.login);
            // res.status(200).json({token}) 
        } catch (e) {
            res.status(500).json({error: e});
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (e) {
            next(e);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(['123', '456'])
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(['123', '456'])
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new authController()