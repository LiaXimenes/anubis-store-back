import express from 'express';
import cors from 'cors';
import connection from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const timelineContent = await connection.query(
            `SELECT * FROM products`
        );
        console.log(timelineContent);
        res.send(timelineContent.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.listen(4000, ()=>{
    console.log('server running on port 4k ;)')
});