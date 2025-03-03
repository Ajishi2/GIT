import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './FollowerList.css';  // We'll create this file next

const FollowerList = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add a back button handler
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

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/followers`);
        setFollowers(response.data);
      } catch (err) {
        console.error("Error fetching followers:", err);
        setError("An error occurred while fetching followers.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchFollowers();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="follower-container">
        <div className="follower-header">
          <h2>Loading followers...</h2>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="follower-container">
        <div className="follower-header">
          <h2>Error</h2>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="follower-container">
      <div className="follower-header">
        <button onClick={handleBack} className="back-button">
          <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
            <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"></path>
          </svg>
          Back
        </button>
        <h2>{followers.length} people following {username}</h2>
      </div>
      
      {followers.length > 0 ? (
        <div className="follower-list">
          {followers.map((follower) => (
            <div key={follower.id} className="follower-item">
              <div className="follower-avatar">
                <Link to={`/user/${follower.login}`}>
                  <img
                    src={follower.avatar_url}
                    alt={follower.login}
                    width="50"
                    height="50"
                  />
                </Link>
              </div>
              <div className="follower-info">
                <div className="follower-name-container">
                  <Link to={`/user/${follower.login}`} className="follower-name">
                    {follower.login}
                  </Link>
                </div>
                {follower.bio && (
                  <p className="follower-bio">{follower.bio}</p>
                )}
              </div>
              <div className="follower-action">
                <button className="follow-button">Follow</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>This user doesn't have any followers yet.</p>
        </div>
      )}
    </div>
  );
};

export default FollowerList;
