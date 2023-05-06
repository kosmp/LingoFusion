import {ObjectId} from 'mongodb';
import {Request} from 'express';
import {EnglishLvl, StatusType, TaskType} from './enums';

export type UserDtoInitType = {
    _id: Promise<ObjectId>;
    login: Promise<string>;
    profile_id: Promise<ObjectId>;
    createdCourses: Promise<Array<ObjectId>>;
}

export type UserDtoModelType = {
    _id: ObjectId;
    login: string;
    profile_id: ObjectId;
    createdCourses: Array<ObjectId>;
}

export interface TaskTemplateModelType {
    _id?: ObjectId;
    title: string;
    description: string;
    expForTrueTask: number;
}

export interface TestModelType extends TaskTemplateModelType {
    question: string;
    trueAnswers: Array<string>;
}

export interface TheoryModelType extends TaskTemplateModelType {
    content: string;
    references: Array<string>;
    images: Array<string>;
}

export interface Blank {
    id: string;
    hint: string;
    answer: string;
    options?: string[];
  }
  

export interface FillInGapsModelType extends TaskTemplateModelType { 
    text: string;
    blanks: Blank[];
}

export interface TaskEnrollmentModelType {
    _id?: ObjectId
    taskTemplateId: ObjectId,
    status: TaskType,
    title: string,
    description: string,
    expForTrueTask: number,
    startedAt: Date,
    completedAt: Date,
    answers: Array<string>
}

export interface CourseTemplateModelType {
    _id?: ObjectId;
    title?: string;
    description?: string;
    englishLvl?: EnglishLvl;
    imageUrl?: string;
    rating?: number;
    taskTemplates?: Array<ObjectId>;
    tags?: Set<string>;
    authorId?: ObjectId;
}

export interface CourseEnrollmentModelType {
    _id?: ObjectId;
    coursePresentationId?: ObjectId;
    title?: string;
    status?: StatusType;
    currentTaskId?: ObjectId;
    startedAt?: Date;
    completedAt?: Date | null;
    tasks?: Array<ObjectId>;
    authorId?: ObjectId;
}

export interface CourseCreateTemplateModelType {
    title: string;
    description: string;
    englishLvl: EnglishLvl;
    imageUrl: string;
    tags: Set<string>;
}

export interface RequestForCreateCourseTemplate extends Request {
    user: UserDtoModelType;
    course: CourseCreateTemplateModelType;
}

export interface RequestWithUserFromMiddleware extends Request {
    user: UserDtoModelType;
}

export interface RequestForUpdateCourse extends Request {
    user: UserDtoModelType;
    course: CourseTemplateModelType;
}