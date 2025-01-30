import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RepoList.css';

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

  if (loading) return <div className="repos-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="repos-container"><div className="error-message">{error}</div></div>;

  return (
    <div className="repos-container">
      <div className="repos-header">
        <h2>Repositories</h2>
        <span className="repo-count">{repos.length}</span>
      </div>

      {repos.length > 0 ? (
        <div className="repos-list">
          {repos.map((repo) => (
            <div key={repo.id} className="repo-item">
              <div className="repo-item-main">
                <h3 className="repo-name">
                  <Link to={`/repos/${username}/${repo.name}`}>{repo.name}</Link>
                </h3>
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                <div className="repo-meta">
                  {repo.language && (
                    <span className="repo-language">
                      <span className="language-color"></span>
                      {repo.language}
                    </span>
                  )}
                  {repo.stargazers_count > 0 && (
                    <span className="repo-stars">
                      ★ {repo.stargazers_count}
                    </span>
                  )}
                  {repo.forks_count > 0 && (
                    <span className="repo-forks">
                      ⑂ {repo.forks_count}
                    </span>
                  )}
                  <span className="repo-updated">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No repositories found.</p>
        </div>
      )}
    </div>
  );
};

export default RepoList;
