import React from 'react';

const UserProfile = ({ userData }) => {
  return (
    <div>
      <h3>User Profile</h3>
      <img src={userData.avatar_url} alt={userData.username} width="100" />
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Location:</strong> {userData.location}</p>
      <p><strong>Bio:</strong> {userData.bio}</p>
      <p><strong>Followers:</strong> {userData.followers}</p>
      <p><strong>Following:</strong> {userData.following}</p>
      <p><strong>Public Repositories:</strong> {userData.public_repos}</p>
    </div>
  );
};

export default UserProfile;
