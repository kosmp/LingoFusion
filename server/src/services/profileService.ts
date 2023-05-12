/* eslint-disable @typescript-eslint/no-var-requires */
import {ObjectId} from "mongodb";
import {Profile} from '../models/profile';
import {User} from '../models/user';
const ApiError = require('../exceptions/apiError');

class ProfileService {
    async getUserProfile(userId: string) {
        if (!ObjectId.isValid(userId)) {
            throw ApiError.BadRequest("Incorrect userId");
        }

        const user = await User.findOneUserById(new ObjectId(userId));
        if (!user) {
            throw ApiError.NotFoundError(`Can't find user with id: ${userId}`);
        }

        const profile = await Profile.findProfileById(user.profile_id);
        if (!profile) {
            throw ApiError.NotFoundError(`Can't find profile with id ${user.profile_id}`);
        }

        return profile;
    }

    async updatePropertyInProfile(userId: string, updatePropertyName: string, updatePropertyValue: string) {
        if (!ObjectId.isValid(userId)) {
            throw ApiError.BadRequest("Incorrect userId");
        }

        const user = await User.findOneUserById(new ObjectId(userId));
        if (!user) {
            throw ApiError.NotFoundError(`Can't find user with id: ${userId}`);
        }

        const profile = await Profile.findProfileById(user.profile_id);
        if (!profile) {
            throw ApiError.NotFoundError(`Can't find profile with id ${user.profile_id}`);
        }
        
        await Profile.updateProfile({
            _id: user.profile_id,
            [updatePropertyName]: updatePropertyValue,
            statistics: profile.statistics
        });

        return await this.getUserProfile(userId);
    }
}

module.exports = new ProfileService();