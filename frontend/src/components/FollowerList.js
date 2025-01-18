import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FollowerList = () => {
  const { username } = useParams();
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {loading ? (
        <p>Loading followers...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{username}'s Followers</h2>
          {followers.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {followers.map((follower) => (
                <li key={follower.id} style={{ marginBottom: '10px' }}>
                  <Link 
                    to={`/repos/${follower.login}`} 
                    style={{ textDecoration: 'none', color: 'blue', display: 'flex', alignItems: 'center' }}
                  >
                    <img
                      src={follower.avatar_url}
                      alt={follower.login}
                      width="50"
                      height="50"
                      style={{ borderRadius: '50%', marginRight: '10px' }}
                    />
                    <p>{follower.login}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>This user has no followers.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FollowerList;
