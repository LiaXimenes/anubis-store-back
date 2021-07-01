import express from 'express';
import cors from 'cors';
import connection from './database.js';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json());

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
    
});

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
});

app.get('/homepage', async (req, res) => {
    const category = req.query.category;
    try {
        let timelineContent;
        if (!category){
            timelineContent = await connection.query(
                `SELECT * FROM products`
            );
        } else {
            timelineContent = await connection.query(
                `SELECT products.* 
                FROM products
                JOIN products_categories
                ON products.id = products_categories."productId"
                JOIN categories
                ON categories.id = products_categories."categoryId"
                WHERE categories.name = $1`, [category]
            );
        }
        return res.status(201).send(timelineContent.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.get('/categories', async (req, res) => {
    try {
        const categoriesList = await connection.query(
            `SELECT name FROM categories`
        );
        res.status(201).send(categoriesList.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

app.post('/cart', async (req, res)=> {//falta testar
    const {productId} = req.body;
    const authorization = req.headers.authorization;
    const token = authorization?.replace("Bearer ", ""); 
    if (!token) return res.sendStatus(401);   
    try {
        const sessionId = await connection.query(
            `SELECT id
            FROM sessions
            WHERE token = $1`,
            [token]
        )
        await connection.query(
            `INSERT INTO cart
            ("sessionId", "productId")
            VALUES ($1, $2)`,
            [sessionId, productId]
        );
    } catch(e) {
        console.log(e);
    }
});

app.get('/cart', async (req, res) => {//falta testar
    try {
        const authorization = req.headers.authorization;
        const token = authorization?.replace("Bearer ", "");
        if (!token) return res.sendStatus(401);
        const productsOnCart = await connection.query(
            `SELECT products.* 
            FROM products
            JOIN cart
            ON products.id = cart."productId"
            JOIN sessions
            ON sessions.id = cart."sessionId"
            WHERE sessions.token = $1`, [token]
        );
        res.status(201).send(productsOnCart.rows);
    } catch(e) {
        console.log(e);
        res.sendStatus(400);
    }
});

export default app;
