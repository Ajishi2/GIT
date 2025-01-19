import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RepoList = () => {
  const { username } = useParams();
  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndRepos = async () => {
      try {
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        setUser(userResponse.data);
        const reposResponse = await axios.get(userResponse.data.repos_url);
        setRepos(reposResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserAndRepos();
    } else {
      setError("Username is required.");
      setLoading(false);
    }
  }, [username]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {user && (
            <div className="user-info">
              <h2>{user.name || user.login}</h2>
              <p>{user.bio || "No bio available."}</p>
              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                style={{ width: 100, borderRadius: '50%' }}
              />
              
              <Link to={`/followers/${username}`} style={{ textDecoration: 'none', color: 'blue' }}>
                <button>View Followers</button>
              </Link>
            </div>
          )}

          <h3>Repositories for {username}</h3>
          {repos.length > 0 ? (
            <ul>
              {repos.map((repo) => (
                <li key={repo.id}>
                  <Link to={`/repo-details/${username}/${repo.name}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    <h4>{repo.name}</h4>
                    <p>{repo.description ? repo.description : "No description available"}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No repositories found for this user.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RepoList;
