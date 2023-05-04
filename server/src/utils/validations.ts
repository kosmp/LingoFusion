import {body} from 'express-validator';
import validator from 'validator';
import {isArray, isString, isNumber} from 'class-validator';
import {EnglishLvl} from '../utils/types';

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

  body('options')
  .optional()
  .notEmpty()
  .custom((value) => isArray(value))
  .withMessage('Options must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('Options must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isString(item)))
  .withMessage('Each item in options must be a string'),

  body('correctAnswers')
  .optional()
  .notEmpty()
  .custom((value) => isArray(value))
  .withMessage('correctAnswers must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('correctAnswers must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isString(item)))
  .withMessage('Each item in correctAnswers must be a string'),

  body('expForTrueAnswers')
  .optional()
  .notEmpty()
  .custom((value) => isArray(value))
  .withMessage('expForTrueAnswers must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('expForTrueAnswers must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isString(item)))
  .withMessage('Each item in expForTrueAnswers must be a string'),

  body('question', 'enter correct question. Min 10 symbols').optional().isLength({min: 10}).isString(),

  body('trueAnswers')
  .optional()
  .notEmpty()
  .custom((value) => isArray(value))
  .withMessage('trueAnswers must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('trueAnswers must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isNumber(item)))
  .withMessage('Each item in trueAnswers must be a number'),

  body('receivedAnswers')
  .optional()
  .notEmpty()
  .custom((value) => isArray(value))
  .withMessage('receivedAnswers must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('receivedAnswers must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isNumber(item)))
  .withMessage('Each item in receivedAnswers must be a number'),

  body('expForTrueTask', 'enter expForTrueTask. Numeric type').optional().notEmpty().isNumeric(),

  body('references')
  .optional()
  .custom((value) => isArray(value))
  .withMessage('references must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('references must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isString(item)))
  .withMessage('Each item in references must be a string'),

  body('images')
  .optional()
  .custom((value) => isArray(value))
  .withMessage('images must be an array')
  .isArray({ min: 1, max: 10 })
  .withMessage('images must have between 1 and 10 items')
  .custom((value) => value.every((item: any) => isString(item)))
  .withMessage('Each item in images must be a string'),

  body('expForTheory', 'enter expForTheory. Only numeric type and not empty').optional().notEmpty().isNumeric()
]