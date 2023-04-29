import {ObjectId} from 'mongodb';

export interface CourseModelType {
    title: string;
    description: string;
    englishLvl: string;
    imageUrl: string;
    tasks: Array<ObjectId>;
}

export enum TaskTypes {
    Theory = 0,
    Test = 1,
    FillGaps = 2
}

export interface TaskModelType {
    title: string;
    description: string;
    taskType: TaskTypes;
    expForTrueAnswer: number;
}

export interface TestModelType extends TaskModelType{
    question: string;
    trueAnswerNum: number;
    receivedAnswerNum: number
}