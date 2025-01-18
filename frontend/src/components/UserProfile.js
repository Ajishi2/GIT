import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ userData }) => {
  const navigate = useNavigate(); // Hook for navigation

  // Correct the avatar URL logic to use userData.login
  const avatarUrl = userData.avatar_url.startsWith('http')
    ? userData.avatar_url
    : `https://avatars.githubusercontent.com/${userData.login}`;

  // Navigate to respective pages when clicked
  const handleNavigation = (path) => {
    navigate(path); // Navigate to the corresponding page
  };

  return (
    <div>
      <h3>User Profile</h3>
      {/* Display Avatar */}
      {avatarUrl && (
        <img 
          src={avatarUrl} 
          alt={userData.login} 
          width="100" 
          height="100" 
          style={{ borderRadius: '50%' }} // Add border-radius for rounded avatar
        />
      )}
      <p><strong>Username:</strong> {userData.login}</p>
      <p><strong>Location:</strong> {userData.location}</p>
      <p><strong>Bio:</strong> {userData.bio || "No bio available"}</p>
      
      {/* Clickable sections for Followers, Following, and Repositories */}
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => handleNavigation(`/followers/${userData.login}`)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: 'rgba(33, 40, 48, 1)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          Followers: {userData.followers}
        </button>
        <button 
          onClick={() => handleNavigation(`/following/${userData.login}`)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: 'rgba(33, 40, 48, 1)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          Following: {userData.following}
        </button>
        <button 
          onClick={() => handleNavigation(`/repos/${userData.login}`)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: 'rgba(33, 40, 48, 1)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          Public Repositories: {userData.public_repos}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
