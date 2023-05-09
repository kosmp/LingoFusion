import {DB} from '../utils/database';
import {ObjectId} from 'mongodb';
import {CourseEnrollmentModelType} from '../utils/types';

export class CourseEnrollment {
    static readonly collection: DB = new DB('course-enrollments');

    static async initialize(model: CourseEnrollmentModelType) {
        const courseEnrollmentId: ObjectId = await this.collection.insertOne({
            coursePresentationId: model.coursePresentationId,
            title: model.title,
            status: model.status,
            currentTaskId: model.currentTaskId,
            startedAt: model.startedAt,
            completedAt: model.completedAt,
            tasks: model.tasks,
            userId: model.userId 
        })

        return courseEnrollmentId;
    }

    static async deleteCourseById(id : ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async updateCourse(model: CourseEnrollmentModelType) {
        await this.collection.updateOne(
            {_id: model._id},
            {...model}
        )
    }

    static async addTaskId(courseId: ObjectId, task: ObjectId) {
        const tasks: Set<ObjectId> = new Set<ObjectId>((await this.collection.findOne({_id: new ObjectId(courseId)}))?.tasks);
        tasks.add(task);
        return await this.collection.findAndUpdateById(courseId, {tasks: Array.from(tasks)});
    }

    static async removeTaskId(courseId: ObjectId, task: ObjectId) {
        const tasks: Array<ObjectId> = (await this.collection.findOne({_id: new ObjectId(courseId)}))?.tasks;

        const taskExists = tasks.some(task => task.equals(new ObjectId(task)));
        
        if (taskExists) {
            const index = tasks.findIndex((el) => el.equals(new ObjectId(task)));
            if (index !== -1) {
                tasks.splice(index, 1);
            }
        }

        return await this.collection.findAndUpdateById(courseId, {tasks: tasks});
    }

    static async findCourseById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }

    static async findCoursesByUserId(userId: ObjectId) {
        return await this.collection.findAll({userId: userId});
    }

    static async findAllCourses() {
        return await this.collection.findAll();
    }
}