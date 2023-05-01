import {ObjectId} from 'mongodb';
import {Request} from 'express';

export type UserDtoInitType = {
    _id: Promise<ObjectId>;
    login: Promise<string>;
    profile_id: Promise<ObjectId>;
}

export enum EnglishLvl {
    A0 = 'A0',
    A1 = 'A1',
    A2 = 'A2',
    B1 = 'B1',
    B2 = 'B2',
    C1 = 'C1',
    C2 = 'C2'
}

export enum TaskType {
    Theory = 0,
    Test = 1,
    FillGaps = 2
}

export interface TaskModelType {
    _id?: ObjectId;
    title: string;
    description: string;
}

export interface TestModelType extends TaskModelType {
    question: string;
    trueAnswers: Array<number>;
    receivedAnswers: Array<number>;
    expForTrueTasK: number;
}

export interface TheoryModelType extends TaskModelType {
    content: string;
    references: Array<string>;
    imagesUrl: Array<string>;
    expForTheory: number;
}

export interface FillInGapsModelType extends TaskModelType {
    content: string;
    options: Array<string>;
    correctAnswers: Array<string>;
    expForTrueAnswers: Array<number>;
}

export type UserDtoModelType = {
    _id: ObjectId;
    login: string;
    profile_id: ObjectId;
}

export interface CourseModelType {
    _id?: ObjectId;
    title: string;
    description: string;
    englishLvl: EnglishLvl;
    imageUrl: string;
    rating: number;
    tasks: Set<ObjectId>;
    tags: Set<string>;
    authorId?: ObjectId;
}

export interface CourseCreateModelType {
    title: string;
    description: string;
    englishLvl: EnglishLvl;
    imageUrl: string;
    tags: Set<string>;
}

export interface RequestForCreateCourse extends Request {
    user?: UserDtoModelType;
    course: CourseCreateModelType;
}

export interface RequestWithUserFromMiddleware extends Request {
    user: UserDtoModelType;
}