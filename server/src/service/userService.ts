/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
const bcrypt = require("bcrypt");
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto').UserDto;
const ApiError = require('../exceptions/apiError');

class UserService {
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
        await userDto.initializeAsync({"id": await user.get_id_async(), "login": await user.get_login(), "profile_id": await user.get_profile_id()});
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
}

module.exports = new UserService();