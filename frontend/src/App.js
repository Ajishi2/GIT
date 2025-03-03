import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserSearch from './components/UserSearch';
import UserProfile from './components/UserProfile';
import FollowerList from './components/FollowerList';
import FollowingList from './components/FollowingList';
import RepoList from './components/RepoList';
import RepoDetails from './components/RepoDetails';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserSearch />} />
      <Route path="/user/:username" element={<UserProfile />} />
      <Route path="/followers/:username" element={<FollowerList />} />
      <Route path="/following/:username" element={<FollowingList />} />
      <Route path="/repos/:username" element={<RepoList />} />
      <Route path="/repos/:username/:repoName" element={<RepoDetails />} />
    </Routes>
  );
};

export default App;
