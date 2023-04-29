import {body} from 'express-validator';

export const authValidation = [
    body('login', "Login can't be empty.").notEmpty(),
    body('login', "Login must be bigger than 4 and less than 12").isLength({min: 4, max: 12}),
    body('password', "Password must be bigger than 4 symbols and less than 10").isLength({min: 4, max: 20}).isStrongPassword()
];

export const postCreateValidation = [
    body('title', 'enter course title').isLength({min: 4}).isString(),
    body('description', 'enter course description').isLength({min: 4}).isString(),
    body('english lvl', 'enter recommended english lvl').isLength({min: 2, max: 2}).isString(),
    body('imageUrl', 'enter link to image').isString()
];