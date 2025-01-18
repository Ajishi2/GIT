import express, { Request, Response } from 'express';
import axios from 'axios';
import { Sequelize } from 'sequelize';
import { AppDataSource } from './database'; // Assuming you are using AppDataSource for TypeORM
import { User, GitHubUser } from './entity/User';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 9001;

app.use(cors());
app.use(express.json());

const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Ensure your GitHub token is set in .env

// Sequelize instance for MySQL connection
const sequelize = new Sequelize('mysql://root:ajishi@localhost:3306/github_friends');

// POST: Create or fetch a user from the database
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

// Other routes...

// Start the server
const startServer = async () => {
    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Initialize AppDataSource for TypeORM (if used) or any other database setup you have
        await AppDataSource.initialize(); // If using TypeORM
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();
