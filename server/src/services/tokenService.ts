import {ObjectId} from "mongodb";
import {Token} from '../models/tokenModel';
const jwt = require('jsonwebtoken');

require('dotenv').config();

class TokenService {
    generateTokens(payload: object) {
        const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: "24h"});
        const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn: "30d"});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: string, newRefreshToken: string) {
        const tokenData = await Token?.findTokenByUserId(new ObjectId(userId));
        
        if (tokenData) {
            await Token.updateToken(tokenData, "refreshToken", newRefreshToken)
            return tokenData;
        }

        const id = await Token.initialize(new ObjectId(userId), newRefreshToken);
        return await Token.findTokenById(id); 
    }

    async removeToken(refreshToken: string) {
        const tokenData = await Token.deleteToken(refreshToken);
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await Token.findToken(refreshToken);
        return tokenData;
    }
}

module.exports = new TokenService();