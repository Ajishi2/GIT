import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FollowingList = () => {
  const { username } = useParams();
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

  return (
    <div>
      {loading ? (
        <p>Loading following...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{username}'s Following</h2>
          {following.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {following.map((followedUser) => (
                <li key={followedUser.id} style={{ marginBottom: '10px' }}>
                  <Link
                    to={`/repos/${followedUser.login}`}
                    style={{ textDecoration: 'none', color: 'blue', display: 'flex', alignItems: 'center' }}
                  >
                    <img
                      src={followedUser.avatar_url}
                      alt={followedUser.login}
                      width="50"
                      height="50"
                      style={{ borderRadius: '50%', marginRight: '10px' }}
                    />
                    <p>{followedUser.login}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>This user is not following anyone.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FollowingList;
