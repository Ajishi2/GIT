import 'reflect-metadata';
import express, { Request, Response } from 'express';
import { Like } from 'typeorm';
import axios from 'axios';
import { connectDatabase, AppDataSource } from './database';
import { User } from './entity/User';

import cors from 'cors';
require('dotenv').config();


const app = express();
const PORT = 6000;



app.use(cors());
// Add this line after initializing your Express app
app.use(express.json());
  

interface GitHubFollower {
    login: string;
    id: number;
}

interface GitHubUser {
    login: string;
    location: string | null;
    blog: string | null;
    bio: string | null;
    followers: number;
    following: number;
    public_repos: number;
    public_gists: number;
}

// Routes
app.post('/api/users', async (req: Request, res: Response) => {
    const { username } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({ where: { username } });

        if (!user) {
            const response = await axios.get<GitHubUser>(`https://api.github.com/users/${username}`);
            user = userRepository.create({
                username: response.data.login,
                location: response.data.location || null,
                blog: response.data.blog || null,
                bio: response.data.bio || null,
                followers: response.data.followers || 0,
                following: response.data.following || 0,
                public_repos: response.data.public_repos || 0,
                public_gists: response.data.public_gists || 0,
                isActive: true,
            });
            await userRepository.save(user);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: (error as Error).message });
    }
});

app.post('/api/users/:username/friends', async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch followers and following from GitHub
        const followersResponse = await axios.get<GitHubFollower[]>(`https://api.github.com/users/${username}/followers`);
        const followingResponse = await axios.get<GitHubFollower[]>(`https://api.github.com/users/${username}/following`);

        // Extract followers and following usernames
        const followers = followersResponse.data.map((f) => f.login);
        const following = followingResponse.data.map((f) => f.login);

        // Find mutual friends
        const mutualFriends = followers.filter((f) => following.includes(f));

        if (mutualFriends.length > 0) {
            res.status(200).json({ mutualFriends });
        } else {
            res.status(200).json({ message: 'No mutual friends found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error fetching friends', error: (error as Error).message });
    }
});
app.get('/api/repos/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const response = await axios.get(`https://api.github.com/users/${userId}/repos`);
      res.json(response.data);
    } catch (error) {
      if (error instanceof Error) {
        // Error object is typed correctly here
        console.error('Error fetching repositories:', error.message);
        res.status(500).json({ error: error.message });
      } else {
        // Handle non-standard error objects
        console.error('Unknown error occurred:', error);
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  });
  
  
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
app.get('/api/users', async (_, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
});

app.put('/api/users/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const { location, blog, bio } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        if (user) {
            user.location = location ?? user.location;
            user.blog = blog ?? user.blog;
            user.bio = bio ?? user.bio;

            const updatedUser = await userRepository.save(user);
            return res.status(200).json(updatedUser);
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
    }
});

app.delete('/api/users/:username', async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        if (user) {
            user.isActive = false; // Soft delete
            await userRepository.save(user);
            return res.status(200).json({ message: 'User soft deleted successfully' });
        }

        res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
});

app.get('/api/users/search', async (req: Request, res: Response) => {
    const { username, location } = req.query;
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
        where: [
            { username: username ? Like(`%${username}%`) : undefined },
            { location: location ? Like(`%${location}%`) : undefined },
        ],
    });

    res.json(users);
});

app.get('/api/users/sorted', async (req: Request, res: Response) => {
    const { sortBy } = req.query; // e.g., public_repos, followers, etc.
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
        where: { isActive: true }, // Only return active users
        order: {
            [sortBy as keyof User]: 'ASC', // Sort by the specified field
        },
    });

    res.json(users);
});
app.get('/api/users/:username', async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user); // Send the user data back
    } catch (err: unknown) {
        // TypeScript now knows that `err` is of type `unknown`, so we need to handle it properly
        if (err instanceof Error) {
            res.status(500).json({ error: 'Database query failed', message: err.message });
        } else {
            res.status(500).json({ error: 'Unknown error', message: 'An unexpected error occurred' });
        }
    }
});

// Start the server
const startServer = async () => {
    await connectDatabase();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
// Graceful shutdown handler
process.on('SIGINT', async () => {
    console.log('Server shutting down...');

    try {
        // Close the database connection gracefully
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Database connection closed.');
        }
    } catch (error) {
        console.error('Error closing database connection:', error);
    } finally {
        process.exit(0);
    }
});
