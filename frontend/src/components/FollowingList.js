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
      if (location.state.previousPath.includes('/user/')) {
        navigate(-1);
      } else {
        navigate(`/user/${username}`);
      }
    } else {
      navigate(`/user/${username}`);
    }
  };

  if (loading) return <div className="following-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="following-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="following-container">
      <div className="following-header">
        <button onClick={handleBack} className="back-button">Back</button>
        <h2>{username} follows {following.length} users</h2>
      </div>
      
      {following.length > 0 ? (
        <div className="following-list">
          {following.map((followedUser) => (
            <div key={followedUser.id} className="following-item">
              <Link to={`/user/${followedUser.login}`} className="following-link">
                <img
                  src={followedUser.avatar_url}
                  alt={followedUser.login}
                  className="following-avatar"
                />
                <div className="following-info">
                  <span className="following-name">{followedUser.login}</span>
                  {followedUser.bio && <p className="following-bio">{followedUser.bio}</p>}
                </div>
              </Link>
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
