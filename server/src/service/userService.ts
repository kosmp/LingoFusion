/* eslint-disable @typescript-eslint/no-var-requires */
import {User} from '../models/user';
const bcrypt = require("bcrypt");
const {validationResult} = require('express-validator');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto').UserDto;

class UserService {
    async registration(login: string, password: string) {
        const candidate = await User.findOneUser({login});
        if (candidate) {
            throw new Error(`User with ${login} exists`);
        }
        
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // const activationLink = uuid.v4();

        // create new user in bd
        const user = new User();
        await user.initialize(login, hashedPassword)
        
        // await mailService.sendActivationMail(login, activationLink);
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