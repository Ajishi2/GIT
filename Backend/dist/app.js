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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const database_1 = require("./database");
const User_1 = require("./entity/User");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const database_2 = require("./database");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const GITHUB_API_URL = 'https://api.github.com/users';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }
    try {
        const response = yield axios_1.default.get(`${GITHUB_API_URL}/${username}`, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`
            }
        });
        const user = new User_1.User();
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
        user.hireable = (_a = data.hireable) !== null && _a !== void 0 ? _a : false;
        user.twitter_username = data.twitter_username;
        user.isActive = true;
        const savedUser = yield database_1.AppDataSource.manager.save(User_1.User, user);
        res.json(savedUser);
    }
    catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Error saving user' });
    }
}));
app.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const users = yield userRepository.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}));
app.get('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
}));
app.put('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        Object.assign(user, updatedData);
        yield userRepository.save(user);
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}));
app.delete('/api/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { username: id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        yield userRepository.remove(user);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}));
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_2.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
});
startServer();
