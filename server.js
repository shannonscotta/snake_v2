import express from "express";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { PORT, DATABASE_URL } = process.env;
const app = express();
const client = new pg.Client({
    connectionString: DATABASE_URL,
});
client.connect();
app.use(express.json());
app.use(express.static("public"));
app.get("/scoreboard", (req, res, next) => {
    client
        .query(`SELECT * FROM scoreboard ORDER BY score DESC`)
        .then((data) => res.send(data.rows))
        .catch(next);
});
app.post("/scoreboard", (req, res, next) => {
    const { player, score } = req.body;
    client
        .query(`INSERT INTO scoreboard(player, score) VALUES ($1, $2) RETURNING *`, [player, score])
        .then((data) => res.status(201).send(data.rows[0]))
        .catch(next);
});
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
