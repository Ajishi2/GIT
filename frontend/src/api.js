import axios from 'axios';

// Base URL for the GitHub API
const BASE_URL = 'https://api.github.com/users';

// Function to fetch user data
export const fetchUserData = async (username) => { // Removed space in function name
    try {
        const response = await axios.get(`${BASE_URL}/${username}`);
        return response.data; // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Function to fetch user repositories
export const fetchUserRepositories = async (username) => { // Removed space in function name
    try {
        const response = await axios.get(`${BASE_URL}/${username}/repos`);
        return response.data; // Return the repositories
    } catch (error) {
        console.error('Error fetching user repositories:', error);
        throw error;
    }
};

// Function to fetch user followers
export const fetchUserFollowers = async (username) => { // Removed space in function name
    try {
        const response = await axios.get(`${BASE_URL}/${username}/followers`);
        return response.data; // Return the followers
    } catch (error) {
        console.error('Error fetching user followers:', error);
        throw error;
    }
};

// Function to fetch user friends (if applicable)
// Note: GitHub does not have a "friends" concept, so this may not be applicable.
export const fetchUserFriends = async (username) => { // Removed space in function name
    // Placeholder for friends functionality
    return []; // Return an empty array or implement as needed
};
