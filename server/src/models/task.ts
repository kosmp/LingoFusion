import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {TaskTypes, TaskModelType} from '../utils/types';

export const tasksDb = new DB('tasks');

export interface Task {
    initialize(model: TaskModelType): Promise<ObjectId>;
    get_id(): Promise<ObjectId>;
    get_title(): Promise<string>;
    get_description(): Promise<string>;
    get_taskType(): Promise<TaskTypes>;
    get_expForTrueAnswer(): Promise<number>;
}