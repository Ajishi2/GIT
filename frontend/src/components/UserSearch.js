import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUser } from '../api';
import './UserSearch.css';

const UserSearch = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await searchUser(username);
            if (userData) {
                navigate(`/user/${username}`);
            }
        } catch (err) {
            console.error("Error:", err);
            setError(err.message || 'An error occurred while searching');
        } finally {
            setLoading(false);
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
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter GitHub username"
                            className="search-input"
                            required
                        />
                        <button 
                            type="submit" 
                            className="search-button"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default UserSearch;
