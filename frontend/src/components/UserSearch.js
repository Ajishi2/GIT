import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (username.trim() === '') {
        setError('Please enter a username');
        return;
      }

      const response = await axios.get(`https://api.github.com/users/${username}`);

      if (response.data) {
        navigate(`/repos/${username}`);  // Make sure the username is passed to the URL
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('User not found or other error occurred');
    }
  };

  return (
    <div>
      <h2>GitHub User Search</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default UserSearch;
