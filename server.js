import express from "express";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const { PORT, DATABASE_URL } = process.env;
const app = express();
const client = new pg.Client({
    connectionString: DATABASE_URL,
});

client.connect();

app.use(express.json());
app.use(cors());

app.get("/scoreboard", getScores);
app.post("/scoreboard", postScore);
async function getScores(_, res, next) {
    try {
        const response = await client.query(
            `SELECT * FROM scoreboard ORDER BY score DESC`
        );
        const data = await response;
        return res.send(data.rows);
    } catch (err) {
        next(err);
    }
}
async function postScore(req, res, next) {
    const { player, score } = req.body;
    try {
        const response = await client.query(
            `INSERT INTO scoreboard(player, score) VALUES ($1, $2) RETURNING *`,
            [player, score]
        );
        const data = await response;
        res.status(201).send(data.rows[0]);
    } catch (err) {
        next(err);
    }
}
app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});
app.use((_, res) => {
    res.sendStatus(404);
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
