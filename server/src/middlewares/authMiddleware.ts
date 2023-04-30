/* eslint-disable @typescript-eslint/no-var-requires */
import {Response, NextFunction} from 'express';
import {RequestWithUser} from '../utils/types';
const ApiError = require('../exceptions/api-error');
const tokenService = require('../services/token-service');

module.exports = function (req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};