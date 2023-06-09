import {Response, NextFunction} from 'express';
import {RequestWithUserFromMiddleware} from '../utils/types';
const {validationResult} = require('express-validator');
const profileService = require('../services/profileService');
const ApiError = require('../exceptions/apiError');

class ProfileController {
    async getUserProfile(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const profile = await profileService.getUserProfile(userId);
            return res.status(200).json(profile);
        } catch (e) {
            return next(e);
        }
    }

    async updateUsernameInProfile(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const userId = req.params.userId;
            const profile = await profileService.updatePropertyInProfile(userId, "username", req.body.username);

            return res.status(200).json(profile);
        } catch (e) {
            return next(e);
        }
    }

    async updateEnglishLvlInProfile(req: RequestWithUserFromMiddleware, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()))
            }

            const userId = req.params.userId;
            const profile = await profileService.updatePropertyInProfile(userId, "englishLvl", req.body.englishLvl);

            return res.status(200).json(profile);
        } catch (e) {
            return next(e);
        }
    }
}

module.exports = new ProfileController()