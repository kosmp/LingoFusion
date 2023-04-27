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
        await userDto.initializeAsync(user); // login, id, profile_id
        const tokens = tokenService.generateTokens({...userDto}); 
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
    
        return {
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new UserService();