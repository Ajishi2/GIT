import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RepoDetails = () => {
  const { username, repoName } = useParams(); // Get 'username' and 'repoName' from URL params
  const [repoDetails, setRepoDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        setRepoDetails(response.data); // Set the repo details in state
      } catch (error) {
        setError('Error fetching repository details');
        console.error(error);
      }
    };

    fetchRepoDetails(); // Fetch repo details when the component mounts
  }, [username, repoName]); // Re-run the effect if the username or repoName changes

  return (
    <div>
      {error && <p>{error}</p>}
      {repoDetails ? (
        <div>
          <h3>{repoDetails.name}</h3>
          <p>{repoDetails.description}</p>
          <p><strong>Stars:</strong> {repoDetails.stargazers_count}</p>
          <p><strong>Forks:</strong> {repoDetails.forks_count}</p>
          {/* Display other repo details here */}
        </div>
      ) : (
        <p>Loading repository details...</p>
      )}
    </div>
  );
};

export default RepoDetails;
