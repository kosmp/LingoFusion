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

    async saveToken(userId: string, newRefreshToken: string) {
        const tokenData = await TokenModel?.getTokenByUserId(userId);
        
        if (tokenData) {
            tokenData.updateToken(tokenData, "refreshToken", newRefreshToken)
            return tokenData;
        }

        const token = new TokenModel();
        token.Initialize(userId, newRefreshToken);
        return token; 
    }
}

module.exports = new TokenService();