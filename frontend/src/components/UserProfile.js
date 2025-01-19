import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ userData }) => {
  const navigate = useNavigate(); 

  const avatarUrl = userData.avatar_url.startsWith('http')
    ? userData.avatar_url
    : `https://avatars.githubusercontent.com/${userData.login}`;

  const handleNavigation = (path) => {
    navigate(path); 
  };

  return (
    <div>
      <h3>User Profile</h3>
    
      {avatarUrl && (
        <img 
          src={avatarUrl} 
          alt={userData.login} 
          width="100" 
          height="100" 
          style={{ borderRadius: '50%' }} 
        />
      )}
      <p><strong>Username:</strong> {userData.login}</p>
      <p><strong>Location:</strong> {userData.location}</p>
      <p><strong>Bio:</strong> {userData.bio || "No bio available"}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => handleNavigation(`/followers/${userData.login}`)}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: 'rgba(33, 40, 48, 1)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}
        >
          Followers: {userData.followers}
        </button>
        <button
  onClick={() => handleNavigation(`/following/${userData.login}`)}
  style={{
    margin: '5px',
    padding: '10px 15px',
    backgroundColor: 'rgba(33, 40, 48, 1)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
  }}
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
