/* eslint-disable @typescript-eslint/no-var-requires */
const ApiError = require('../exceptions/apiError');
const bcrypt = require("bcrypt");
import {ObjectId} from "mongodb";
import {Profile} from '../models/profile';
import {User} from '../models/user';
import {Token} from "../models/tokenModel";

class UserService {
    async getUser(userId: string) {
        if (!ObjectId.isValid(userId)) {
            throw ApiError.BadRequest("Incorrect userId");
        }

        const user = await User.findOneUserById(new ObjectId(userId));
        if (!user) {
            throw ApiError.NotFoundError(`Can't find user with id: ${userId}`);
        }

        return user;
    }

    async deleteUser(userId: string) {
        const user = await User.findOneUserById(new ObjectId(userId));
        if (!user) {
            throw ApiError.NotFoundError(`Can't find user with id: ${userId}`);
        }  
        await User.deleteUserById(new ObjectId(userId));

        const tokenDoc = await Token.findTokenByUserId(new ObjectId(userId));
        if (!tokenDoc) {
            throw ApiError.BadRequest("Not found tokenDoc to delete");
        }
        await Token.findTokenByIdAndDelete(tokenDoc._id);

        const profileDoc = await Profile.findProfileById(new ObjectId(user.profile_id));
        if (!profileDoc) {
            throw ApiError.BadRequest("Not found profileDoc to delete");
        }

        const result = (await Profile.deleteProfileById(profileDoc._id)).value;
        if (!result) {
            throw ApiError.BadRequest(`User with id ${userId} has not been deleted`);
        }

        return result;
    }

    async updateUserPassword(userId: string, login: string, newPassword: string) {
        let hashedPassword = newPassword;
        if (hashedPassword) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        const user = await User.findOneUserById(new ObjectId(userId));
        if (!user) {
            throw ApiError.NotFoundError(`Can't find user with id: ${userId}`);
        }

        if (login != user.login) {
            throw ApiError.BadRequest("Incorrect user login");
        }
        
        const result = await User.findUserByIdAndUpdate(new ObjectId(userId), {password: hashedPassword});

        if (result.matchedCount == 0 || result.modifiedCount == 0) {
            throw ApiError.BadRequest(`User with id ${userId} has not been updated`);
        }

        return result.modifiedCount;
    }
}

module.exports = new UserService();