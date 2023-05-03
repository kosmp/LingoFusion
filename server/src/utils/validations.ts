import {body} from 'express-validator';
import validator from 'validator';
import {EnglishLvl} from '../utils/types';
import {ObjectId} from 'mongodb';

const validTags = new Set(['tag1', 'tag2', 'tag3']);

export const authValidation = [
    body('login', "Login can't be empty.").notEmpty(),
    body('login', "Login must be bigger than 5 and less than 20").isLength({min: 5, max: 20}),
    body('password', "Password must be bigger than 5 symbols and less than 20").isLength({min: 5, max: 20})
];

export const courseCreateValidation = [
    body('title', 'enter correct course title').isLength({min: 5}).isString(),
    body('description', 'enter correct course description').isLength({min: 10, max: 230}).isString(),
    body('englishLvl')
    .notEmpty()
    .isIn(Object.values(EnglishLvl))
    .withMessage(`englishLvl must be one of [${Object.values(EnglishLvl)}]`),
    body('imageUrl', 'enter link to image').isString(),
    body('tags')
    .custom((tags: string[]) => {
      if (tags.length !== new Set(tags).size) {
        throw new Error('tags should contain unique values');
      }
      // Check if tags from validTags
      for (const tag of tags) {
        if (!validator.isIn(tag, Array.from(validTags))) {
          throw new Error(`Invalid tag: ${tag}`);
        }
      }
      return true;
    })
    .withMessage('Tags are invalid')
];

export const courseUpdateValidation = [
    body('title', 'enter correct course title').isLength({min: 5}).isString(),
    body('description', 'enter correct course description').isLength({min: 10, max: 230}).isString(),
    body('englishLvl', 'enter correct englishLvl')
    .notEmpty()
    .isIn(Object.values(EnglishLvl))
    .withMessage(`englishLvl must be one of [${Object.values(EnglishLvl)}]`),
    body('imageUrl', 'enter link to image').isString(),
    body('rating', 'enter correct rating')
    .isInt()
    .isIn([0, 1, 2, 3, 4, 5])
    .withMessage('Rating should be a number between 0 and 5'),
    // body('tasks', 'enter tasks')
    // .bail()
    // .custom((value: string[]) => {
    //   if (value.length !== new Set(value).size) {
    //     throw new Error('objectIdList should contain unique values');
    //   }
    //   if (value.some(id => !ObjectId.isValid(id))) {
    //     throw new Error('Invalid ObjectId format found in objectIdList');
    //   }
    //   return true;
    // })
    // .withMessage('Invalid ObjectId format found in objectIdList or it contains duplicate values. Must be list of non-duplicated ObjectId values'),
    body('tags')
    .custom((tags: string[]) => {
      if (tags.length !== new Set(tags).size) {
        throw new Error('tags should contain unique values');
      }
      // Check if tags from validTags
      for (const tag of tags) {
        if (!validator.isIn(tag, Array.from(validTags))) {
          throw new Error(`Invalid tag: ${tag}`);
        }
      }
      return true;
    })
    .withMessage('Tags are invalid. Must be list of non-duplicated values from validTags')
];

export const userUpdateValidation = [
  body('login', "Login can't be empty.").notEmpty(),
  body('login', "Login must be bigger than 5 and less than 20").isLength({min: 5, max: 20}),
  body('password', "Password must be bigger than 5 symbols and less than 20").isLength({min: 5, max: 20})
];

export const taskCreateUpdateValidation = [
  body('title', 'enter correct task title. Min 5').isLength({min: 5}).isString(),
  body('description', 'enter correct task description. Min 5, max 50').isLength({min: 5, max: 50}).isString(),
  body('content', 'enter correct content text. Min 10').optional().isLength({min: 10}).isString(),
  body('options').optional(),
  body('correctAnswers').optional(),
  body('expForTrueAnswers').optional(),
  body('question', 'enter correct question. Min 10 symbols').optional().isLength({min: 10}).isString(),
  body('trueAnswers').optional(),
  body('receivedAnswers').optional(),
  body('expForTrueTask', 'enter expForTrueTask. Numeric type').optional().isNumeric(),
  body('references').optional(),
  body('images').optional(),
  body('expForTheory', 'enter expForTheory. Only int type and not empty').optional().notEmpty().isInt()
]