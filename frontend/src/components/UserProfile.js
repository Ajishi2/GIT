import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}`);
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  const handleNavigation = (path) => {
    navigate(path, { 
      state: { 
        previousPath: location.pathname,
        username: username
      }
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="error-message">User not found</div>
      </div>
    );
  }

  const avatarUrl = userData.avatar_url.startsWith('http')
    ? userData.avatar_url
    : `https://avatars.githubusercontent.com/${userData.login}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            src={avatarUrl} 
            alt={userData.login} 
            className="profile-avatar"
          />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userData.name || userData.login}</h1>
          <p className="profile-login">{userData.login}</p>
          {userData.bio && <p className="profile-bio">{userData.bio}</p>}
          {userData.location && (
            <p className="profile-location">
              <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
                <path fillRule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path>
              </svg>
              {userData.location}
            </p>
          )}
        </div>
      </div>

      <div className="profile-nav">
        <nav className="profile-nav-tabs">
          <button 
            className="nav-tab"
            onClick={() => handleNavigation(`/repos/${userData.login}`)}
          >
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
            </svg>
            <span>Repositories</span>
            <span className="counter">{userData.public_repos}</span>
          </button>

          <button 
            className="nav-tab"
            onClick={() => handleNavigation(`/followers/${userData.login}`)}
          >
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
            </svg>
            <span>Followers</span>
            <span className="counter">{userData.followers}</span>
          </button>

          <button 
            className="nav-tab"
            onClick={() => handleNavigation(`/following/${userData.login}`)}
          >
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
            </svg>
            <span>Following</span>
            <span className="counter">{userData.following}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default UserProfile;
