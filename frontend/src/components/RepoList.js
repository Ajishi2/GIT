import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RepoList = () => {
  const { username } = useParams(); // Get 'username' from URL params
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        console.log("Fetching repositories for user:", username);
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        console.log("Fetched Repositories:", response.data);
        setRepos(response.data);
      } catch (err) {
        setError('Error fetching repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  return (
    <div>
      <h3>Repositories for {username}</h3>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : repos.length > 0 ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <button onClick={() => navigate(`/repo-details/${username}/${repo.name}`)}>
                {repo.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
};

export default RepoList;
