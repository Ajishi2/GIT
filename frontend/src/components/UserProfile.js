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

  if (loading) return <div className="profile-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="profile-container"><div className="error-message">{error}</div></div>;
  if (!userData) return <div className="profile-container"><div className="error-message">User not found</div></div>;

  const avatarUrl = userData.avatar_url.startsWith('http')
    ? userData.avatar_url
    : `https://avatars.githubusercontent.com/${userData.login}`;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={avatarUrl} alt={userData.login} className="profile-avatar" />
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
          <button onClick={() => handleNavigation(`/repos/${userData.login}`)} className="nav-tab">
            <span>Repositories</span>
            <span className="counter">{userData.public_repos}</span>
          </button>
          <button onClick={() => handleNavigation(`/followers/${userData.login}`)} className="nav-tab">
            <span>Followers</span>
            <span className="counter">{userData.followers}</span>
          </button>
          <button onClick={() => handleNavigation(`/following/${userData.login}`)} className="nav-tab">
            <span>Following</span>
            <span className="counter">{userData.following}</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default UserProfile;
