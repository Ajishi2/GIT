GitHub User Explorer
Project Overview
This project consists of a full-stack application for exploring GitHub user data. It includes:

A backend service built with Node.js, Express, and TypeScript that interacts with the GitHub API and stores user data
A frontend React application that allows users to explore GitHub profiles, repositories, and follower networks

Backend Features

Fetches and caches GitHub user data
Identifies mutual followers and marks them as "friends"
Provides search functionality by username, location, etc.
Supports soft deletion of user records
Allows updating of user profile information
Supports sorting of user lists by various criteria

Frontend Features

Search interface for GitHub usernames
User profile display with repository listings
Detailed repository view
Follower exploration with navigation between users
Efficient caching to minimize GitHub API calls

Tech Stack
Backend

Node.js
Express.js
TypeScript
SQL Database (PostgreSQL recommended)
Sequelize ORM

Frontend

React (with Hooks)
Custom CSS (no frameworks)
Context API for state management

Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn
PostgreSQL database

Backend Setup

Clone the repository
bashCopygit clone https://github.com/yourusername/github-user-explorer.git
cd github-user-explorer/backend

Install dependencies
bashCopynpm install

Configure environment variables
CopyDATABASE_URL=postgresql://username:password@localhost:5432/github_explorer
PORT=3001

Run database migrations
bashCopynpm run migrate

Start the development server
bashCopynpm run dev


Frontend Setup

Navigate to the frontend directory
bashCopycd ../frontend

Install dependencies
bashCopynpm install

Configure environment variables
CopyREACT_APP_API_URL=http://localhost:3001/api

Start the development server
bashCopynpm start


API Endpoints
EndpointMethodDescription/api/users/:usernameGETGet user details (fetches from GitHub if not in DB)/api/users/:username/friendsGETGet mutual followers (friends) for a user/api/users/searchGETSearch users by criteria/api/users/:usernameDELETESoft delete a user record/api/users/:usernamePATCHUpdate user information/api/usersGETGet all users with sorting options
Project Structure

Deploy the Application

Deploy to GitHub Pages:
If this project is configured for GitHub Pages:
npm run deploy
Deploy to a Hosting Service (e.g., Vercel, Netlify):

https://git-kappa-pied.vercel.app/

