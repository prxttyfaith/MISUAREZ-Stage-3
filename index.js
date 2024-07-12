require('dotenv').config();
const mysql = require("mysql2");
const express = require("express");
const app = express();
app.use(express.json());

const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected");
    }
});

app.get("/", (req, res) => {
    res.send("Javascript");
});

app.post('/', (req, res) => {
    const { favorite } = req.body;
    db.query(`INSERT INTO programming_languages (favorites) VALUES (?)`, [favorite], (err, result) => {
        if (err) {
            res.status(500).send('Failed to insert the favorite programming language.');
            throw err;
        }
        res.status(200).send('Successfully added favorite programing language.');
    });
});

app.get('/programming_languages', async (req, res) => {
    try {
        const query = 'SELECT * FROM programming_languages;';
        db.query(query, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to retrieve programming languages.');
            }
            res.json(results);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error occurred while fetching programming languages.');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


/*
Test the API using curl:
curl -X GET http://localhost:3000/programming_languages
*/