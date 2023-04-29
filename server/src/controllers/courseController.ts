/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
import {Request, Response, NextFunction} from 'express';

class CourseController {
    async createCourse(req: Request, res: Response, next: NextFunction) {
        try {
            
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CourseController();