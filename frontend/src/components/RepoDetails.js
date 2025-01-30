import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './RepoDetails.css';

const RepoDetails = () => {
  const { username, repoName } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        setRepo(response.data);
      } catch (err) {
        console.error("Error fetching repository details:", err);
        setError(`An error occurred: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [username, repoName]);

  if (loading) return <div className="repo-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="repo-container"><div className="error-message">{error}</div></div>;
  if (!repo) return <div className="repo-container"><div className="error-message">Repository not found.</div></div>;

  return (
    <div className="repo-container">
      <div className="repo-header">
        <div className="repo-header-info">
          <div className="repo-name-container">
            <Link to={`/user/${username}`} className="repo-owner">{username}</Link>
            <span className="repo-name-separator">/</span>
            <h1 className="repo-name">{repoName}</h1>
            <span className="repo-visibility">Public</span>
          </div>
          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}
        </div>
      </div>

      <div className="repo-stats">
        <div className="repo-stat">
          <span className="stat-label">Stars</span>
          <span className="stat-value">{repo.stargazers_count}</span>
        </div>
        <div className="repo-stat">
          <span className="stat-label">Forks</span>
          <span className="stat-value">{repo.forks_count}</span>
        </div>
        <div className="repo-stat">
          <span className="stat-label">Watchers</span>
          <span className="stat-value">{repo.watchers_count}</span>
        </div>
      </div>

      <div className="repo-details">
        <div className="repo-info">
          <h3>Repository Information</h3>
          <p><strong>Created:</strong> {new Date(repo.created_at).toLocaleDateString()}</p>
          <p><strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()}</p>
          <p><strong>Language:</strong> {repo.language || 'Not specified'}</p>
          {repo.homepage && (
            <p><strong>Homepage:</strong> <a href={repo.homepage} target="_blank" rel="noopener noreferrer">{repo.homepage}</a></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;
