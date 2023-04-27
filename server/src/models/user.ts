import {DB, courses} from '../database';
import {Profile} from "./profile";
import {ObjectId} from 'mongodb';

export class User {
    static readonly usersDb: DB = new DB('users');
    readonly db!: DB;
    private id!: ObjectId;

    constructor() {
        this.db = User.usersDb;
    }

    async initialize(login: string, password: string) {
        const user_profile = new Profile()
        const profile_id = await user_profile.initialize()
        
        this.id = await this.db.insertOne({
            login: login,
            password: password,
            profile_id: profile_id
        })
        return this.id;
    }

    get_id() {
        return this.id;
    }

    async get_id_async() {
        return (await this.db.findOne({_id: this.id}))?._id;
    }

    async get_login() {
        return (await this.db.findOne({_id: this.id}))?.login;
    }

    async get_password() {
        return (await this.db.findOne({_id: this.id}))?.password;
    }

    async get_profile_id() {
        return (await this.db.findOne({_id: this.id}))?.profile_id;
    }

    async set_login(login: string) {
        await this.db.updateOneField({_id: this.id}, 'login', login)
    }

    static async findOneUser(query: object) {
        return await User.usersDb.findOne(query);
    }

    static async findOneUserById(user_id: string) {
        return await User.usersDb.findOne({_id: user_id});
    }

    static async findUserByIdAndUpdate(id: string, newObject: object) {
        return await User.usersDb.findAndUpdateById(new ObjectId(id), newObject);
    }

    static async deleteUserById(id: string) {
        return await User.usersDb.findAndDeleteById(new ObjectId(id));
    }
}
