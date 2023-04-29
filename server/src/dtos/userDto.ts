import {ObjectId} from 'mongodb';
import { User } from '../models/user';

type ModelType = {
    _id: Promise<ObjectId>;
    login: Promise<string>;
    profile_id: Promise<ObjectId>;
}

export class UserDto {
    public login!: string;
    public id!: ObjectId;
    public profile_id!: ObjectId;

    async initializeAsync(model: ModelType) {
        this.id = await model._id;
        this.login = await model.login;
        this.profile_id = await model.profile_id;
    }
}