import express, { Request, Response } from 'express';
import axios from 'axios';
import { AppDataSource } from './database';
import { User, GitHubUser } from './entity/User';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 9001;

const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://git-kappa-pied.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// API Routes
app.post('/api/users', async (req: Request, res: Response): Promise<void> => {
    const { username } = req.body;

    if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
    }

    try {
        const existingUser = await AppDataSource.getRepository(User).findOne({
            where: { username }
        });

        if (existingUser) {
            res.json(existingUser);
            return;
        }

        const response = await axios.get<GitHubUser>(`${GITHUB_API_URL}/${username}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            },
            timeout: 30000
        });

        const user = new User();
        const data = response.data;
        
        user.username = data.login;
        user.name = data.name;
        user.location = data.location;
        user.blog = data.blog;
        user.bio = data.bio;
        user.followers = data.followers;
        user.following = data.following;
        user.public_repos = data.public_repos;
        user.public_gists = data.public_gists;
        user.avatar_url = data.avatar_url;
        user.html_url = data.html_url;
        user.company = data.company;
        user.email = data.email;
        user.hireable = data.hireable ?? false;
        user.twitter_username = data.twitter_username;
        user.isActive = true;

        const savedUser = await AppDataSource.manager.save(User, user);
        res.json(savedUser);
    } catch (error) {
        console.error('Error processing request:', error);
        const err = error as { response?: { status?: number; data?: { message?: string } }; code?: string };
        
        if (err.code === 'ECONNABORTED') {
            res.status(504).json({ message: 'Request timed out. Please try again.' });
            return;
        }
        
        if (err.response?.status === 404) {
            res.status(404).json({ message: 'GitHub user not found' });
            return;
        }
        
        res.status(err.response?.status || 500).json({ 
            message: err.response?.data?.message || 'Error processing request'
        });
    }
});

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

app.get('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
    }
});

app.put('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        Object.assign(user, updatedData);
        await userRepository.save(user);

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
    }
});

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username: id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await userRepository.remove(user);
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: (error as Error).message });
    }
});

const startServer = async (): Promise<void> => {
    try {
        await connectDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
        process.exit(1);
    }
};

void startServer();

export default app;

