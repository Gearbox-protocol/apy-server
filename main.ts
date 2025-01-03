import express from 'express';
import dotenv from 'dotenv';
import { Fetcher, } from './src/fetcher';
import cors from "cors";
dotenv.config();

import { checkResp, getAll, getByChainAndToken, getRewardList } from './src/endpoints'

const app = express();
const port = process.env.PORT ?? 8000;
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
    methods: 'GET,PUT,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization'
}));

let f = new Fetcher();
(async function run() {
    await f.loop();
}());

app.get('/api/rewards/all/', (req, res) => {
    getAll(req, res, f)
});
app.get('/api/rewards/:chainId/:tokenAddress', (req, res) => {
    getByChainAndToken(req, res, f)
});
app.post('/api/rewards/list', (req, res) => {
    getRewardList(req, res, f)
});
app.get('/api/rewards/list', (req, res) => {
    checkResp({
        status: "error",
        description: "Method Not Allowed: use POST"
    }, res);
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});


