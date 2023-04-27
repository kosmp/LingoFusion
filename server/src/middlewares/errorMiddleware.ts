/* eslint-disable @typescript-eslint/no-var-requires */
import {Request, Response, NextFunction} from 'express';
const ApiError = require('../exceptions/apiError');

module.exports = function (err: typeof ApiError, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err?.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: 'Unexpected error'})
};
