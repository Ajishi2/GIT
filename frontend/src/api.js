import axios from 'axios';

const BASE_URL = 'https://api.github.com/users';
const BACKEND_URL = 'https://gitt-tw1s.onrender.com/api';

// Create axios instance with timeout
const axiosInstance = axios.create({
    timeout: 30000, // 30 seconds
});

// GitHub API calls
export const searchUser = async (username) => {
    try {
        const backendResponse = await axiosInstance.post(`${BACKEND_URL}/users`, {
            username: username
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return backendResponse.data;
    } catch (error) {
        console.error('Error in searchUser:', error);
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please try again.');
        }
        if (error.response?.status === 404) {
            throw new Error('User not found');
        }
        throw new Error(error.response?.data?.message || 'Error searching for user');
    }
};

export const fetchUserRepositories = async (username) => {
    try {
        const response = await axios.get(`${BASE_URL}/${username}/repos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
};

export const fetchUserFollowers = async (username) => {
    try {
        const response = await axios.get(`${BASE_URL}/${username}/followers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching followers:', error);
        throw error;
    }
};

export const fetchUserFollowing = async (username) => {
    try {
        const response = await axios.get(`${BASE_URL}/${username}/following`);
        return response.data;
    } catch (error) {
        console.error('Error fetching following:', error);
        throw error;
    }
};

export const fetchUserFriends = async (username) => {
    // Placeholder for friends functionality
    return []; // Return an empty array or implement as needed
};
