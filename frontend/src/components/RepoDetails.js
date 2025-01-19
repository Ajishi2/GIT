import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RepoDetails = () => {
  const { username, repoName } = useParams();  
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        console.log(`Fetching details for repo: ${repoName} by ${username}`); 
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        console.log(response.data);  
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

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : repo ? (
        <>
          <h2>{repo.name}</h2>
          <p><strong>Description:</strong> {repo.description || "No description available."}</p>
          <p><strong>Stars:</strong> {repo.stargazers_count}</p>
          <p><strong>Forks:</strong> {repo.forks_count}</p>
          <p><strong>Language:</strong> {repo.language || "Not specified"}</p>
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
        </>
      ) : (
        <p>Repository not found.</p>
      )}
    </div>
  );
};

export default RepoDetails;
