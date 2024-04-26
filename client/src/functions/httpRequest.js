import axios from 'axios';
import { host } from '../config';

class httpRequestClass {

    constructor(){
        axios.defaults.headers.common['Content-Type'] = "application/json";
        axios.defaults.baseURL = host;
        axios.defaults.withCredentials = true;
    }

    get = async (url, options) => {
        const response = await axios.get(url, { signal: options?.signal }).catch(e => e);
        this.verifyIfLoginExpired(response);
        return response?.data;
    }

    post = async (url, data) => {
        const response = await axios.post(url, data).catch(e => e);
        this.verifyIfLoginExpired(response);
        return response?.data;
    }

    put = async (url, data) => {
        const response = await axios.put(url, data).catch(e => e);
        this.verifyIfLoginExpired(response);
        return response?.data;
    }

    del = async (url) => {
        const response = await axios.delete(url).catch(e => e);
        this.verifyIfLoginExpired(response);
        return response?.data;
    }

    verifyIfLoginExpired(response){
        if(response?.data?.code === "3"){
            console.log("Login expired");
            if (String(window.location.pathname).indexOf("auth/login") === -1) {
                return window.location.href = '/auth/login';
            }
        }
        return null;
    }

}

export const httpRequest = new httpRequestClass();