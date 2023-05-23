import $api from "../http";

export default class AuthService {
    static async login(login, password) {
        return await $api.post('/auth/login', {login, password});
    }

    static async registration(login, password) {
        return await $api.post('/auth/register', {login, password});
    }

    static async logout() {
        return await $api.post('/auth/logout');
    }
}