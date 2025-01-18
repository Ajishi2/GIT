// app.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import { AppDataSource } from './database';
import { User, GitHubUser } from './entity/User';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 9001;

app.use(cors());
app.use(express.json());

const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure your GitHub token is set in .env

// app.ts
app.post('/api/users', async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        
        // Check if the user already exists in the database
        let user = await userRepository.findOne({ where: { username } });

        if (user) {
            // User already exists, return the existing data
            return res.status(200).json(user);
        } else {
            // User does not exist, call the GitHub API
            const response = await axios.get<GitHubUser>(`${GITHUB_API_URL}/${username}`, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}` // Use the GitHub token for authenticated requests
                }
            });

            // Create a new User object to save in the database
            user = new User();
            user.username = response.data.login;
            user.name = response.data.name ?? null;
            user.location = response.data.location ?? null;
            user.blog = response.data.blog ?? null;
            user.bio = response.data.bio ?? null;
            user.followers = response.data.followers;
            user.following = response.data.following;
            user.public_repos = response.data.public_repos;
            user.public_gists = response.data.public_gists;
            user.company = response.data.company ?? null;
            user.email = response.data.email ?? null;
            user.hireable = response.data.hireable ?? null;
            user.twitter_username = response.data.twitter_username ?? null;

            // Save the user to the database
            await userRepository.save(user);
        }

        // Return the user data
        res.status(200).json(user);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: (error as Error).message });
    }
});


// Get all users
app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
    }
});

// Get a user by ID
app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
    }
});

// Update a user by ID
app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Update user properties
        Object.assign(user, updatedData);
        await userRepository.save(user);

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
    }
});

// Delete a user by ID
app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        await userRepository.remove(user);
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
});

// Start the server
const startServer = async () => {
    await AppDataSource.initialize(); // Ensure database connection is established before server starts
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();