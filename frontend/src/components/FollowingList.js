import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './FollowingList.css';

const FollowingList = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/following`);
        setFollowing(response.data);
      } catch (err) {
        console.error("Error fetching following:", err);
        setError("An error occurred while fetching following.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchFollowing();
    }
  }, [username]);

  const handleBack = () => {
    if (location.state?.previousPath) {
      // If we have a previous path and it includes 'user', use it
      if (location.state.previousPath.includes('/user/')) {
        navigate(-1);
      } else {
        // Otherwise go to user profile
        navigate(`/user/${username}`);
      }
    } else {
      // Fallback to user profile
      navigate(`/user/${username}`);
    }
  };

  if (loading) {
    return (
      <div className="following-container">
        <div className="following-header">
          <h2>Loading following...</h2>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="following-container">
        <div className="following-header">
          <h2>Error</h2>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="following-container">
      <div className="following-header">
        <button onClick={handleBack} className="back-button">
          <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
            <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"></path>
          </svg>
          Back
        </button>
        <h2>{username} follows {following.length} users</h2>
      </div>
      
      {following.length > 0 ? (
        <div className="following-list">
          {following.map((followedUser) => (
            <div key={followedUser.id} className="following-item">
              <div className="following-avatar">
                <Link to={`/user/${followedUser.login}`}>
                  <img
                    src={followedUser.avatar_url}
                    alt={followedUser.login}
                    width="50"
                    height="50"
                  />
                </Link>
              </div>
              <div className="following-info">
                <div className="following-name-container">
                  <Link to={`/user/${followedUser.login}`} className="following-name">
                    {followedUser.login}
                  </Link>
                </div>
                {followedUser.bio && (
                  <p className="following-bio">{followedUser.bio}</p>
                )}
              </div>
              <div className="following-action">
                <button className="follow-button">Follow</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>This user isn't following anyone yet.</p>
        </div>
      )}
    </div>
  );
};

export default FollowingList;
