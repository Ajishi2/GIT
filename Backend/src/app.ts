import express, { Request, Response } from 'express';
import axios from 'axios';
import { AppDataSource } from './database';
import { User, GitHubUser } from './entity/User';
import cors from 'cors';
import 'dotenv/config';
import { connectDatabase } from './database'; 

const app = express();
const PORT = process.env.PORT || 9001;

app.use(cors());
app.use(express.json());

const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; 


app.post('/api/users', async (req: Request, res: Response) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);

       
        let user = await userRepository.findOne({ where: { username } });

        if (user) {
           
            return res.status(200).json(user);
        } else {
            
            const response = await axios.get<GitHubUser>(`${GITHUB_API_URL}/${username}`, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}` 
                }
            });

           
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

        
            await userRepository.save(user);
        }

      
        res.status(200).json(user);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: (error as Error).message });
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


const startServer = async () => {
    try {
        await connectDatabase(); 
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();

