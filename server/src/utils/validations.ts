import {body} from 'express-validator';
import validator from 'validator';
import {isArray, isString} from 'class-validator';
import {EnglishLvl} from '../utils/enums';

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

export const updateCourseRatingValidation = [
    body('rating', 'Enter rating from 1 to 5').isInt({min: 1, max: 5})
] 

export const updateProfileUsernameValidation = [
    body('username', 'Enter username. Min 2, max 20 alpha symbols.')
    .isLength({min: 2, max: 20})
    .isAlpha()
]

export const updateProfileEnglishLvlValidation = [
    body('englishLvl', 'Enter englishLvl in the correct format')
    .notEmpty()
    .isIn(Object.values(EnglishLvl))
    .withMessage(`englishLvl must be one of [${Object.values(EnglishLvl)}]`),
]

export const userUpdateValidation = [
    body('login', "Login can't be empty.").notEmpty(),
    body('login', "Login must be bigger than 5 and less than 20").isLength({min: 5, max: 20}),
    body('password', "Password must be bigger than 5 symbols and less than 20").isLength({min: 5, max: 20})
];

export const taskCreateUpdateValidation = [
    body('title', 'Enter correct task title. Min 5')
    .isLength({min: 5})
    .isString(),
    body('description', 'Enter correct task description. Min 5, max 50')
    .isLength({min: 5, max: 50})
    .isString(),
    body('expForTrueTask', 'Enter expForTrueTask. Int type')
    .notEmpty()
    .isInt(),
    body('question', 'Enter correct qustion text. Min 10')
    .optional()
    .isLength({min: 10})
    .isString(),
    body('content', 'Enter correct content text. Min 10')
    .optional()
    .isLength({min: 10})
    .isString(),
    body('text', 'Enter correct text. Min 10 symbols')
    .optional().
    isLength({min: 10})
    .isString(),
    body('trueAnswers', "Enter answers. List of strings")
    .optional()
    .custom((value) => isArray(value))
    .withMessage('userAnswers must be an array')
    .custom((value) => value.every((item: any) => isString(item)))
    .withMessage('Each item in userAnswers must be a string'),
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
    body('blanks').isArray().withMessage('The "blanks" field must be an array'),
    body('blanks.*').isObject().withMessage('Each element in the "blanks" array must be an object'),
    body('blanks.*.answer').isString().withMessage('Each object in the "blanks" array must have a "answer" property of type string'),
    body('blanks.*.options').optional().isArray().withMessage('If provided, the "options" property in each object of the "blanks" array must be an array'),
    body('blanks.*.options.*').isString().withMessage('Each element in the "options" array must be a string')
]

export const taskSubmitValidation = [
    body('userAnswers', "Enter answers. List of strings")
    .optional()
    .custom((value) => isArray(value))
    .withMessage('userAnswers must be an array')
    .custom((value) => value.every((item: any) => isString(item)))
    .withMessage('Each item in userAnswers must be a string')
]