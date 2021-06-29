import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

import connection from "../src/connection.js";


const app = express();
app.use(express.json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    const {name, email, password} = req.body;

    const hash = bcrypt.hashSync(password, 10);

    try{
        const result = await connection.query(`
            SELECT * 
            FROM customers 
            WHERE email = $1
        `, [email])

        if(result.rows.length !== 0){
            return res.sendStatus(403)

        } else{
            await connection.query(`
                INSERT INTO customers (name, email, password) 
                VALUES ($1, $2, $3)
            `, [name, email, hash])

            return res.sendStatus(200);
        }
    } catch{
        res.sendStatus(500);
    }
})

export default app;