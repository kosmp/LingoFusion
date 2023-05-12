import {DB} from '../utils/database';
import {Profile} from "./profile";
import {ObjectId} from 'mongodb';
import {EnglishLvl, UserCourseProperty} from '../utils/enums';

export class User {
    static readonly collection: DB = new DB('users');

    static async initialize(login: string, password: string) {
        const userId: ObjectId = await this.collection.insertOne({
            login: login,
            password: password,
            profile_id: await Profile.initialize({
                username: '',
                email: '',
                englishLvl: EnglishLvl.A0,
                statistics: {
                    totalUserCountOfCompletedCourses: 0,
                    totalUserCountInProgressCourses: 0,
                    totalUserCountOfCreatedCourses: 0
                }
            }),
            courseEnrollments: [],
            createdCourses: []
        });

        return userId;
    }

    static async deleteUserById(id: ObjectId) {
        return await this.collection.findAndDeleteById(id);
    }

    static async addCourseToUserById(userId: ObjectId, courseId: ObjectId, property: UserCourseProperty) {
        const user = await this.collection.findOne({_id: new ObjectId(userId)});
        
        if (user) {
          const courses: Array<ObjectId> = user[property] || [];
          courses.push(courseId);
          await this.collection.findAndUpdateById(userId, {[property]: courses});
        }
    }

    static async removeCourseFromUserById(userId: ObjectId, courseId: ObjectId, property: UserCourseProperty) {
        const tempCourses: Array<ObjectId> = (await this.collection.findOne({_id: new ObjectId(userId)}))?.[property];

        const index = tempCourses.findIndex((el) => el.equals(courseId));
        if (index !== -1) {
            tempCourses.splice(index, 1);
        }

        return await this.collection.findAndUpdateById(userId, {[property]: tempCourses});
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
