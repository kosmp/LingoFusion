import {DB} from '../utils/database';
import {Profile} from "./profile";
import {ObjectId} from 'mongodb';

export class User {
    static readonly collection: DB = new DB('users');

    static async initialize(login: string, password: string) {
        const userId: ObjectId = await this.collection.insertOne({
            login: login,
            password: password,
            profile_id: await Profile.initialize(),
            createdCourses: []
        });

        return userId;
    }

    static async deleteUserById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async addCourseToCreatedById(userId: ObjectId, courseId: ObjectId) {
        const user = await this.collection.findOne({_id: new ObjectId(userId)});
        
        if (user) {
          const courses: Array<ObjectId> = user.createdCourses || [];
          courses.push(courseId);
          await this.collection.findAndUpdateById(userId, {createdCourses: courses});
        }
    }

    static async removeCourseFromCreatedById(userId: ObjectId, courseId: ObjectId) {
        const tempCourses: Array<ObjectId> = (await this.collection.findOne({_id: new ObjectId(userId)}))?.createdCourses;

        const index = tempCourses.findIndex((el) => el.equals(courseId));
        if (index !== -1) {
            tempCourses.splice(index, 1);
        }

        return await this.collection.findAndUpdateById(userId, {createdCourses: tempCourses});
    }

    static async findOneUser(query: object) {
        return await this.collection.findOne(query);
    }

    static async findOneUserById(id: ObjectId) {
        return await this.collection.findOne({_id: new ObjectId(id)});
    }

    static async findUserByIdAndUpdate(id: ObjectId, newObject: object) {
        return await this.collection.findAndUpdateById(id, newObject);
    }
}
