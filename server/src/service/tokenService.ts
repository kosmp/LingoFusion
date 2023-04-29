/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
const TokenModel = require('../models/tokenModel').Token;

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
        const tokenData = await TokenModel?.getTokenByUserId(userId);
        
        if (tokenData) {
            TokenModel.updateToken(tokenData, "refreshToken", newRefreshToken)
            return tokenData;
        }

        const token = new TokenModel();
        token.Initialize(userId, newRefreshToken);
        return token; 
    }

    async removeToken(refreshToken: string) {
        const tokenData = await TokenModel.deleteToken(refreshToken);
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findToken(refreshToken);
        return tokenData;
    }
}

module.exports = new TokenService();