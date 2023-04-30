import {DB} from '../utils/database';
import {Profile} from "./profile";
import {ObjectId} from 'mongodb';

export const users = new DB('users');

export class User {
    private _id!: ObjectId;

    async initialize(login: string, password: string) {
        const user_profile = new Profile()
        const profile_id = await user_profile.initialize()
        
        this._id = await users.insertOne({
            login: login,
            password: password,
            profile_id: profile_id
        })
        return this._id;
    }

    async get_id() {
        return this._id;
    }

    async get_login() {
        return (await users.findOne({_id: this._id}))?.login;
    }

    async get_password() {
        return (await users.findOne({_id: this._id}))?.password;
    }

    async get_profile_id() {
        return (await users.findOne({_id: this._id}))?.profile_id;
    }

    async set_login(login: string) {
        await users.updateOneField({_id: this._id}, 'login', login)
    }

    static async findOneUser(query: object) {
        return await users.findOne(query);
    }

    static async findOneUserById(id: ObjectId) {
        return await users.findOne({_id: id});
    }

    static async findUserByIdAndUpdate(id: ObjectId, newObject: object) {
        return await users.findAndUpdateById(id, newObject);
    }

    static async deleteUserById(id: ObjectId) {
        return await users.findAndDeleteById(id);
    }
}
