import {ObjectId} from 'mongodb';
import { User } from '../models/user';

export class UserDto {
    public login!: string;
    public id!: ObjectId;
    public profile_id!: ObjectId;

    async initializeAsync(model: User)
    {
        await model.get_login().then((loginn) => {
            this.login = loginn;
        })
        .catch((error) => { console.log(error)})

        await model.get_id_async().then((idd) => {
            this.id = new ObjectId(idd);
        })
        .catch((error) => { console.log(error)})
        
        await model.get_profile_id().then((profileId) => {
            this.profile_id = new ObjectId(profileId);
        })
        .catch((error) => { console.log(error)})
    }
}