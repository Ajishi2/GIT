import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FollowerList = () => {
  const { username } = useParams();
  const [followers, setFollowers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get(`https://api.github.com/users/${username}/followers`);
        setFollowers(response.data);
      } catch (err) {
        console.error('Error fetching followers:', err);
      }
    };

    fetchFollowers();
  }, [username]);

  return (
    <div>
      <h2>{username}'s Followers</h2>
      <div>
        {followers.map((follower) => (
          <div key={follower.id} onClick={() => navigate(`/repos/${follower.login}`)}>
            <h3>{follower.login}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowerList;
