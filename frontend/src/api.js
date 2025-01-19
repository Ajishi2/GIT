import axios from 'axios';


const BASE_URL = 'https://api.github.com/users';


export const fetchUserData = async (username) => { 
    try {
        const response = await axios.get(`${BASE_URL}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; 
    }
};


export const fetchUserRepositories = async (username) => {
    try {
        const response = await axios.get(`${BASE_URL}/${username}/repos`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching user repositories:', error);
        throw error;
    }
};


export const fetchUserFollowers = async (username) => { 
    try {
        const response = await axios.get(`${BASE_URL}/${username}/followers`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching user followers:', error);
        throw error;
    }
};


export const fetchUserFriends = async (username) => {
    // Placeholder for friends functionality
    return []; // Return an empty array or implement as needed
};
