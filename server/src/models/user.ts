import {DB} from '../utils/database';
import {Profile} from "./profile";
import {ObjectId} from 'mongodb';

export const usersDb = new DB('users');

export class User {
    private id!: ObjectId;

    async initialize(login: string, password: string) {
        const user_profile = new Profile()
        const profile_id = await user_profile.initialize()
        
        this.id = await usersDb.insertOne({
            login: login,
            password: password,
            profile_id: profile_id
        })
        return this.id;
    }

    async get_id() {
        return this.id;
    }

    async get_login() {
        return (await usersDb.findOne({_id: this.id}))?.login;
    }

    async get_password() {
        return (await usersDb.findOne({_id: this.id}))?.password;
    }

    async get_profile_id() {
        return (await usersDb.findOne({_id: this.id}))?.profile_id;
    }

    async set_login(login: string) {
        await usersDb.updateOneField({_id: this.id}, 'login', login)
    }

    static async findOneUser(query: object) {
        return await usersDb.findOne(query);
    }

    static async findOneUserById(id: string) {
        return await usersDb.findOne({_id: new ObjectId(id)});
    }

    static async findUserByIdAndUpdate(id: string, newObject: object) {
        return await usersDb.findAndUpdateById(new ObjectId(id), newObject);
    }

    static async deleteUserById(id: string) {
        return await usersDb.findAndDeleteById(new ObjectId(id));
    }
}
