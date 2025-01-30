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

  if (loading) {
    return (
      <div className="repos-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repos-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

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
                <div className="repo-item-name">
                  <Link to={`/repo-details/${username}/${repo.name}`} className="repo-link">
                    {repo.name}
                  </Link>
                  <span className="repo-visibility">Public</span>
                </div>
                
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}

                <div className="repo-meta">
                  {repo.language && (
                    <span className="repo-language">
                      <span className={`language-color ${repo.language.toLowerCase()}`}></span>
                      {repo.language}
                    </span>
                  )}
                  
                  {repo.stargazers_count > 0 && (
                    <span className="repo-stat">
                      <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                      </svg>
                      {repo.stargazers_count}
                    </span>
                  )}
                  
                  {repo.forks_count > 0 && (
                    <span className="repo-stat">
                      <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                      </svg>
                      {repo.forks_count}
                    </span>
                  )}

                  <span className="repo-updated">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="repo-item-action">
                <button className="star-button">
                  <svg className="octicon" viewBox="0 0 16 16" width="16" height="16">
                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                  </svg>
                  Star
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{username} doesn't have any public repositories yet.</p>
        </div>
      )}
    </div>
  );
};

export default RepoList;
