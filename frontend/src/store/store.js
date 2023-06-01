import {makeAutoObservable} from "mobx";
import AuthService from "../services/authService";
import axios from 'axios';
import {API_URL} from "../http";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;
    errorCallback = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    setErrorCallback(callback) {
        this.errorCallback = callback;
      }

    async login(login, password) {
        try {
            const response = await AuthService.login(login, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return true;
        } catch (e) {
            const errorMessages = e.response.data.errors.map(error => error.msg);
            this.errorCallback(e.response?.data?.message + '. ' + errorMessages);
            return false;
        }
    }

    async registration(login, password) {
        try {
            const response = await AuthService.registration(login, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return true;
        } catch (e) {
            const errorMessages = e.response.data.errors.map(error => error.msg);
            this.errorCallback(e.response?.data?.message + '. ' + errorMessages);
            return false;
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({});
            return true;
        } catch (e) {
            console.log(e.response?.data?.message);
            return false;
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/auth/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false);
        }
    }
}