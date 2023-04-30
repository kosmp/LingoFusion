import {body} from 'express-validator';

const hashtagsValidator = (value: string | undefined) => {
    if (!value) {
      return true;
    }
    const hashtags = value.split(',');
    const regex = /^#\w+$/; // check hashtag format
    for (let i = 0; i < hashtags.length; i++) {
      if (!regex.test(hashtags[i].trim())) {
        return false; // false if at least one doesn't match to format
      }
    }
    return true; // true if all hashtags matches to format
};

export const authValidation = [
    body('login', "Login can't be empty.").notEmpty(),
    body('login', "Login must be bigger than 4 and less than 12").isLength({min: 4, max: 12}),
    body('password', "Password must be bigger than 4 symbols and less than 10").isLength({min: 4, max: 20}).isStrongPassword()
];

export const courseCreateValidation = [
    body('title', 'enter course title').isLength({min: 4}).isString(),
    body('description', 'enter course description').isLength({min: 4}).isString(),
    body('english lvl', 'enter recommended english lvl').isLength({min: 2, max: 2}).isString(),
    body('imageUrl', 'enter link to image').isString(),
    body('tags').custom(hashtagsValidator)
];