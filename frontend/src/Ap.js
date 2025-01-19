import FollowingList from './components/FollowingList'; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import UserSearch from './components/UserSearch'; 
import RepoList from './components/RepoList';
import FollowerList from './components/FollowerList';
import RepoDetails from './components/RepoDetails';

const Ap = () => {
  return (
    <Router>
      <div>
        <h1>GitHub User Explorer</h1>
        <Routes>
          <Route path="/" element={<UserSearch />} />
          <Route path="/repos/:username" element={<RepoList />} />
          <Route path="/followers/:username" element={<FollowerList />} />
          <Route path="/following/:username" element={<FollowingList />} /> {/* Following Route */}
          <Route path="/repo-details/:username/:repoName" element={<RepoDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Ap;
