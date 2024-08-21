import axios from 'axios';

const API_URL = 'https://your-api-url.com'; // change to your actual API URL

export const loginUser = (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

