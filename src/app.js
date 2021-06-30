import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';

import connection from "../src/connection.js";


const app = express();
app.use(express.json());
app.use(cors());

app.post("/sign-up", async (req, res) => {
    const {name, email, password} = req.body;

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false}}).required(),
        password: Joi.string().min(5).required(),
    })

    const validation = schema.validate(req.body)

    const hash = bcrypt.hashSync(password, 10);

    
    if(!validation.error){
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

    } else{
        res.sendStatus(400);
    }  
    
})

app.post("/log-in", async (req, res) => {
    const {email, password} = req.body;
    const token = uuid();

    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false}}).required(),
        password: Joi.string().min(5).required()
    })

    const validation = schema.validate(req.body)

    if(!validation.error){
        try{
            const result = await connection.query(`
            SELECT * 
            FROM customers
            WHERE email = $1        
            `, [email])
    
            const user = result.rows[0];
            if(user && bcrypt.compareSync(password, user.password)){
                await connection.query(`
                INSERT INTO sessions ("userId", token) 
                VALUES ($1,$2)
                `, [user.id, token]);
    
                res.status(200).send(token);
            } else {
                res.sendStatus(401);
            }
    
        } catch{
            res.sendStatus(500);
        }

    } else{
        res.sendStatus(400);
    }
})

export default app;