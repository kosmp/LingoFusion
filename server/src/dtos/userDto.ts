import {ObjectId} from 'mongodb';
import { User } from '../models/user';

type ModelType = {
    id: Promise<number>;
    login: Promise<string>;
    profile_id: Promise<number>;
  }

export class UserDto {
    public login!: string;
    public id!: ObjectId;
    public profile_id!: ObjectId;

    async initializeAsync(model: ModelType) {
        this.id = new ObjectId(await model.id);
        this.login = await model.login;
        this.profile_id = new ObjectId(await model.profile_id);
    }
}