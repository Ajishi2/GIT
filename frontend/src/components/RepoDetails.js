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

  if (loading) {
    return (
      <div className="repo-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repo-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="repo-container">
        <div className="error-message">Repository not found.</div>
      </div>
    );
  }

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
        </div>

        <div className="repo-stats">
          <button className="repo-stat-button">
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
            <span>Star</span>
            <span className="stat-count">{repo.stargazers_count}</span>
          </button>

          <button className="repo-stat-button">
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
            </svg>
            <span>Fork</span>
            <span className="stat-count">{repo.forks_count}</span>
          </button>
        </div>
      </div>

      <div className="repo-content">
        <div className="repo-description">
          {repo.description || "No description provided."}
        </div>

        {repo.topics && repo.topics.length > 0 && (
          <div className="repo-topics">
            {repo.topics.map(topic => (
              <span key={topic} className="repo-topic">{topic}</span>
            ))}
          </div>
        )}

        <div className="repo-meta">
          {repo.language && (
            <span className="repo-language">
              <span className={`language-color ${repo.language.toLowerCase()}`}></span>
              {repo.language}
            </span>
          )}
          
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
            <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
              <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.75.75 0 0 1-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path>
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;
