import React, { useState } from 'react';
import UserProfile from './UserProfile'; 
import axios from 'axios';
import './UserSearch.css'; 

const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null); 
    const [error, setError] = useState('');
    const [saveMessage, setSaveMessage] = useState(''); 

    const handleSearch = async (event) => {
        event.preventDefault();
        setError('');
        setUserData(null); 
        setSaveMessage('');

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
                throw new Error('User not found or error occurred');
            }
            const data = await response.json();
            setUserData(data);

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
                isActive: 1
            };

            try {
                await axios.post('https://gitt-tw1s.onrender.com/api/users', userPayload);
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
        <div className="user-search-container">
            <div className="search-header">
                <h1>GitHub User Explorer</h1>
                <p className="search-subtitle">Search and explore GitHub profiles</p>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <div className="search-icon">
                            <svg height="16" viewBox="0 0 16 16" width="16" className="search-icon-svg">
                                <path fillRule="evenodd" d="M11.5 7a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm-.82 4.74a6 6 0 111.06-1.06l3.04 3.04a.75.75 0 11-1.06 1.06l-3.04-3.04z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Search GitHub username"
                            className="search-input"
                            required
                        />
                        <button type="submit" className="search-button">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {error && <div className="message-container error-message">{error}</div>}
            {saveMessage && (
                <div className={`message-container ${saveMessage.includes('success') ? 'success-message' : 'error-message'}`}>
                    {saveMessage}
                </div>
            )}

            {userData && (
                <div className="user-profile-container">
                    <UserProfile userData={userData} />
                </div>
            )}
        </div>
    );
};

export default UserSearch;
