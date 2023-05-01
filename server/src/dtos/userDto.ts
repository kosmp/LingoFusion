import {ObjectId} from 'mongodb';
import {UserDtoInitType} from '../utils/types';

export class UserDto {
    public login!: string;
    public _id!: ObjectId;
    public profile_id!: ObjectId;

    async initializeAsync(model: UserDtoInitType) {
        this._id = await model._id;
        this.login = await model.login;
        this.profile_id = await model.profile_id;
    }
}