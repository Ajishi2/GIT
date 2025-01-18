import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RepoDetails = () => {
  const { repoId } = useParams();
  const [repoDetails, setRepoDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      try {
        const response = await axios.get(`https://api.github.com/repositories/${repoId}`);
        setRepoDetails(response.data);
      } catch (err) {
        setError('Error fetching repository details');
      }
    };

    fetchRepoDetails();
  }, [repoId]);

  return (
    <div>
      {error && <p>{error}</p>}
      {repoDetails ? (
        <div>
          <h3>{repoDetails.name}</h3>
          <p><strong>Description:</strong> {repoDetails.description}</p>
          <p><strong>Stars:</strong> {repoDetails.stargazers_count}</p>
          <p><strong>Forks:</strong> {repoDetails.forks_count}</p>
        </div>
      ) : (
        <p>Loading repository details...</p>
      )}
    </div>
  );
};

export default RepoDetails;
