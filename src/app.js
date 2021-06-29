import express from 'express';
import cors from 'cors';
import {v4 as uuid} from 'uuid';
import joi from 'joi';
import connection from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async(req, res) => {
    try {
        const timeline = await connection.query(
            `SELECT * FROM products`
        );
        
    } catch(e) {
        console.log(e);
        res.sendStatus();
    }
});