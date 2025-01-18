import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RepoList = () => {
  const { userId } = useParams();
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/repos/${userId}`);
        setRepos(response.data);
      } catch (err) {
        setError('Error fetching repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [userId]);

  return (
    <div>
      <h3>Repositories</h3>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : repos.length > 0 ? (
        <ul>
          {repos.map((repo) => (
            <li key={repo.id}>
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
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
