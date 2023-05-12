/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const userService = require('../services/userService');
const {validationResult} = require('express-validator');
import {Request, Response, NextFunction} from 'express';
import {RequestWithUserFromMiddleware} from '../utils/types';

class UserController {
    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const user = await userService.getUser(userId);

            return res.status(200).json(user);
        } catch (e) {
            return next(e);
        }
    }
    
    async patchUserPassword(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }

            const userId = req.user._id;
            if (userId.toString() !== req.params.userId) {
                return next(ApiError.AccessForbidden("You can update only your account!"))
            }

            await userService.updateUserPassword(userId, req.body.login, req.body.password);

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }

    async deleteUser(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.user._id;

            if (userId.toString() !== req.params.userId) {
                return next(ApiError.AccessForbidden("You can delete only your account!"));
            }

            await userService.deleteUser(userId);

            return res.status(200).json({success: true});
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new UserController()