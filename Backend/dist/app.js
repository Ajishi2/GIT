"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const database_1 = require("./database");
const User_1 = require("./entity/User");
const cors_1 = __importDefault(require("cors"));
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 6000;
app.use((0, cors_1.default)());
// Add this line after initializing your Express app
app.use(express_1.default.json());
// Routes
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        let user = yield userRepository.findOne({ where: { username } });
        if (!user) {
            const response = yield axios_1.default.get(`https://api.github.com/users/${username}`);
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
            yield userRepository.save(user);
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}));
app.post('/api/users/:username/friends', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Fetch followers and following from GitHub
        const followersResponse = yield axios_1.default.get(`https://api.github.com/users/${username}/followers`);
        const followingResponse = yield axios_1.default.get(`https://api.github.com/users/${username}/following`);
        // Extract followers and following usernames
        const followers = followersResponse.data.map((f) => f.login);
        const following = followingResponse.data.map((f) => f.login);
        // Find mutual friends
        const mutualFriends = followers.filter((f) => following.includes(f));
        if (mutualFriends.length > 0) {
            res.status(200).json({ mutualFriends });
        }
        else {
            res.status(200).json({ message: 'No mutual friends found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching friends', error: error.message });
    }
}));
app.get('/api/repos/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const response = yield axios_1.default.get(`https://api.github.com/users/${userId}/repos`);
        res.json(response.data);
    }
    catch (error) {
        if (error instanceof Error) {
            // Error object is typed correctly here
            console.error('Error fetching repositories:', error.message);
            res.status(500).json({ error: error.message });
        }
        else {
            // Handle non-standard error objects
            console.error('Unknown error occurred:', error);
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
}));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get('/api/users', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const users = yield userRepository.find();
    res.json(users);
}));
app.put('/api/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const { location, blog, bio } = req.body;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username } });
        if (user) {
            user.location = location !== null && location !== void 0 ? location : user.location;
            user.blog = blog !== null && blog !== void 0 ? blog : user.blog;
            user.bio = bio !== null && bio !== void 0 ? bio : user.bio;
            const updatedUser = yield userRepository.save(user);
            return res.status(200).json(updatedUser);
        }
        res.status(404).json({ message: 'User not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}));
app.delete('/api/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username } });
        if (user) {
            user.isActive = false; // Soft delete
            yield userRepository.save(user);
            return res.status(200).json({ message: 'User soft deleted successfully' });
        }
        res.status(404).json({ message: 'User not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}));
app.get('/api/users/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, location } = req.query;
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const users = yield userRepository.find({
        where: [
            { username: username ? (0, typeorm_1.Like)(`%${username}%`) : undefined },
            { location: location ? (0, typeorm_1.Like)(`%${location}%`) : undefined },
        ],
    });
    res.json(users);
}));
app.get('/api/users/sorted', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sortBy } = req.query; // e.g., public_repos, followers, etc.
    const userRepository = database_1.AppDataSource.getRepository(User_1.User);
    const users = yield userRepository.find({
        where: { isActive: true }, // Only return active users
        order: {
            [sortBy]: 'ASC', // Sort by the specified field
        },
    });
    res.json(users);
}));
app.get('/api/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user); // Send the user data back
    }
    catch (err) {
        // TypeScript now knows that `err` is of type `unknown`, so we need to handle it properly
        if (err instanceof Error) {
            res.status(500).json({ error: 'Database query failed', message: err.message });
        }
        else {
            res.status(500).json({ error: 'Unknown error', message: 'An unexpected error occurred' });
        }
    }
}));
// Start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.connectDatabase)();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
startServer();
// Graceful shutdown handler
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Server shutting down...');
    try {
        // Close the database connection gracefully
        if (database_1.AppDataSource.isInitialized) {
            yield database_1.AppDataSource.destroy();
            console.log('Database connection closed.');
        }
    }
    catch (error) {
        console.error('Error closing database connection:', error);
    }
    finally {
        process.exit(0);
    }
}));
