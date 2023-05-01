/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
const bcrypt = require("bcrypt");
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto').UserDto;
const ApiError = require('../exceptions/apiError');
import {ObjectId} from 'mongodb';

class AuthService {
    async registration(login: string, password: string) {
        const candidate = await User.findOneUser({login});
        if (candidate) {
            throw ApiError.BadRequest(`User with login ${login} exists`);
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User();
        await user.initialize(login, hashedPassword)

        const userDto = new UserDto();
        await userDto.initializeAsync({"_id": await user.get_id(), "login": await user.get_login(), "profile_id": await user.get_profile_id()});
        const tokens = tokenService.generateTokens({...userDto}); 
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
    
        return {
            ...tokens,
            user: userDto
        }
    }

    async login(login: string, password: string) {
        const user = await User.findOneUser({login});
        
        if (!user) {
            throw ApiError.BadRequest(`User with login ${login} doesn't exist`);
        }

        const isPassEqual = await bcrypt.compare(password, await user.password);
        
        if (!isPassEqual) {
            throw ApiError.BadRequest('Incorrect password');
        }

        const userDto = new UserDto();
        await userDto.initializeAsync(user);
        const tokens = tokenService.generateTokens({...userDto}); 
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken: string) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findOneUserById(new ObjectId(userData._id));
        const userDto = new UserDto();
        await userDto.initializeAsync(user);
        const tokens = tokenService.generateTokens({...userDto}); 
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }
}

module.exports = new AuthService();