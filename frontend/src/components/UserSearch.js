// components/UserSearch.js
import React, { useState } from 'react';
import UserProfile from './UserProfile'; // Correct import (no space)
import axios from 'axios'; // Import axios for backend requests
import './UserSearch.css'; 
const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null); // Corrected state variable
    const [error, setError] = useState('');
    const [saveMessage, setSaveMessage] = useState(''); // For save success/error feedback

    const handleSearch = async (event) => {
        event.preventDefault();
        setError('');
        setUserData(null); // Corrected here
        setSaveMessage('');

        try {
            // Fetch user data from GitHub API
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                throw new Error('User not found or error occurred');
            }
            const data = await response.json();
            setUserData(data); // Corrected here

            // Prepare the payload for the backend
            const userPayload = {
                username: data.login,
                name: data.name || null,
                location: data.location || null,
                blog: data.blog || null,
                bio: data.bio || null,
                followers: data.followers || 0,
                following: data.following || 0,
                public_repos: data.public_repos || 0,
                public_gists: data.public_gists || 0,
                avatar_url: data.avatar_url || null,
                html_url: data.html_url || null,
                company: data.company || null,
                email: data.email || null,
                hireable: data.hireable || false,
                twitter_username: data.twitter_username || null,
                isActive: 1, // Default value for active users
            };

            // Automatically save user data to the backend
            try {
                await axios.post('https://gitt-tw1s.onrender.com/api/users', userPayload); // Adjust the backend endpoint as needed
                setSaveMessage('User data saved successfully!');
            } catch (saveError) {
                setSaveMessage('Failed to save user data. Please try again.');
                console.error('Error saving user data:', saveError);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub username"
                    required
                />
                <button type="submit">Search</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {userData && (
                <div>
                    <UserProfile userData={userData} /> {/* Fixed import */}
                </div>
            )}

            {saveMessage && <p>{saveMessage}</p>}
        </div>
    );
};

export default UserSearch;
