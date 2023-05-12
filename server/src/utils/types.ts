import {ObjectId} from 'mongodb';
import {Request} from 'express';
import {EnglishLvl, TaskStatusType, CourseStatusType, TaskType} from './enums';

export type UserDtoInitType = {
    _id: Promise<ObjectId>;
    login: Promise<string>;
    profile_id: Promise<ObjectId>;
    createdCourses: Promise<Array<ObjectId>>;
    courseEnrollments: Promise<Array<ObjectId>>;
}

export type UserDtoModelType = {
    _id: ObjectId;
    login: string;
    profile_id: ObjectId;
    createdCourses: Array<ObjectId>;
    courseEnrollments: Array<ObjectId>;
}

export type UserStatistics = {
    totalUserCountOfCompletedCourses: number;
    totalUserCountInProgressCourses: number;
    totalUserCountOfCreatedCourses: number;
}

export type ProfileModelType = {
    _id?: ObjectId;
    username?: string;
    email?: string;
    englishLvl?: EnglishLvl;
    statistics: UserStatistics;
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
    answer: string;
    options?: string[];
  }
  

export interface FillInGapsModelType extends TaskTemplateModelType { 
    text: string;
    blanks: Blank[];
}

export interface TaskEnrollmentModelType {
    _id?: ObjectId,
    taskTemplateId?: ObjectId,
    taskType?: TaskType,
    status?: TaskStatusType,
    title?: string,
    description?: string,
    expForTask?: number,
    startedAt?: Date | null,
    completedAt?: Date | null,
    userAnswers?: Array<string> | null
}

export interface CourseStatistics {
    resultExp?: number,
    counterOfTrueTasks?: number
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
    status?: CourseStatusType;
    currentTaskId?: ObjectId | null;
    startedAt?: Date | null;
    completedAt?: Date | null;
    tasks?: Array<ObjectId>;
    statistics?: CourseStatistics;
    userId?: ObjectId;
    maxPossibleExpAmount?: number;
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