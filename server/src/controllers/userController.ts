/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const {validationResult} = require('express-validator');
const courseService = require('../services/courseService');
import {User} from '../models/user';
import {ObjectId} from 'mongodb';
import {Request, Response, NextFunction} from 'express';
import {RequestWithUserFromMiddleware} from '../utils/types';
import {Token} from '../models/tokenModel';
import {Profile} from '../models/profile';
const bcrypt = require("bcrypt");

class UserController {
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;

            if (!ObjectId.isValid(userId)) {
                return next(ApiError.BadRequest("Incorrect userId"));
            }

            const user = await User.findOneUserById(new ObjectId(userId));
    
            if (!user) {
                return next(ApiError.NotFoundError(`Can't find user with id: ${userId}`));
            }
    
            return res.status(200).json(user);
        } catch (e) {
            return next(e);
        }
    }
    
    async patchUserPassword(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Validation error", errors.array()));
        }

        if (req.user._id.toString() === req.params.userId) {
            let hashedPassword = req.body.password;
            
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10);
                    hashedPassword = await bcrypt.hash(req.body.password, salt);
                } catch (e) {
                    return next(e); 
                }
            }
            try {
                const user = await User.findOneUserById(new ObjectId(req.params.userId));
                if (!user) {
                    return next(ApiError.NotFoundError(`Can't find user with id: ${req.params.userId}`));
                }

                if (req.body.login != user.login) {
                    return next(ApiError.BadRequest("Enter correct user login", errors.array()));
                }
                
                await User.findUserByIdAndUpdate(new ObjectId(req.params.userId), {password: hashedPassword});
                return res.status(200).json("Account has been updated");
            } catch (e) {
                return next(e);
            }
        } else {
            return next(ApiError.AccessForbidden("You can update only your account!"))
        }
    }

    async deleteUser(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        if (req.user._id.toString() === req.params.userId) {
            try {
                const user = await User.findOneUserById(new ObjectId(req.params.userId));
                if (!user) {
                    return next(ApiError.NotFoundError(`Can't find user with id: ${req.params.userId}`));
                }
                
                await User.deleteUserById(new ObjectId(req.params.userId));

                const tokenDoc = await Token.findTokenByUserId(new ObjectId(req.params.userId));

                if (!tokenDoc) {
                    return next(ApiError.BadRequest("Not found tokenDoc to delete with User"));
                }
                await Token.findTokenByIdAndDelete(tokenDoc._id);

                const profileDoc = await Profile.findProfileById(new ObjectId(req.user.profile_id));
                
                if (!profileDoc) {
                    return next(ApiError.BadRequest("Not found profileDoc to delete with User"));
                }
                await Profile.deleteProfileById(profileDoc._id);

                return res.status(200).json("Account has been deleted");
            } catch (e) {
                return next(e);
            }
        } else {
            return res.status(403).json("You can delete only your account!");
        }
    }


}

module.exports = new UserController()