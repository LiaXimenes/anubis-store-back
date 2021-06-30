import supertest from 'supertest';
import app from '../src/app.js';
import bcrypt from 'bcrypt';
import connection from "../src/connection.js";

beforeEach(async () => {
    await connection.query(`DELETE FROM customers`);
    await connection.query(`DELETE FROM sessions`)
});

afterAll(() => {
    connection.end();
});

describe("POST /sign-up", () => {
    it("returns 200 for valid params", async () =>{
        const body = {
            name: "user", 
            email: "teste@teste.com",
            password:"12345"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(200);
    })

    it("returns 400 for invalid joi password", async () =>{
        const body = {
            name: "user", 
            email: "teste@teste.com",
            password:"123"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(400);
    })

    it("returns 400 for invalid joi user", async () =>{
        const body = {
            name: "us", 
            email: "teste@teste.com",
            password:"12345"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(400);
    })

    it("returns 400 for invalid joi email", async () =>{
        const body = {
            name: "user", 
            email: "testeteste.teste",
            password:"12345"
        }

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(400);
    })

    it("returns 403 for existent email", async () =>{
        const body = {
            name: "user", 
            email: "teste@teste.com",
            password:"12345"
        }

        await connection.query(`
            INSERT INTO customers (name, email, password) 
            VALUES ($1,$2,$3)
        `, [body.name, body.email, body.password])

        const result = await supertest(app).post("/sign-up").send(body);
        expect(result.status).toEqual(403);
    })
})

describe("POST /log-in", () => {
    it("returns 200 for right password", async () => {
        const name = "user"; 
        const hash = bcrypt.hashSync("12345", 10);

        const body = {
            email: "teste@teste.com",
            password:"12345"
        }
        
    
        await connection.query(`
            INSERT INTO customers (name, email, password) 
            VALUES ($1,$2,$3)
        `, [name, body.email, hash])

        const result = await supertest(app).post("/log-in").send(body);
        expect(result.status).toEqual(200);
    
    }) 

    it("returns 401 for wrong password", async () => {
        const name = "user"; 
        const hash = bcrypt.hashSync("123456", 10);

        const body = {
            email: "teste@teste.com",
            password:"12345"
        }
    
        await connection.query(`
            INSERT INTO customers (name, email, password) 
            VALUES ($1,$2,$3)
        `, [name, body.email, hash])
    

        const result = await supertest(app).post("/log-in").send(body);
        expect(result.status).toEqual(401);

    })

    it("returns 400 for invalid joi password", async () =>{
        const body = {
            email: "teste@teste.com",
            password:"123"
        }

        const result = await supertest(app).post("/log-in").send(body);
        expect(result.status).toEqual(400);
    })

    it("returns 400 for invalid joi email", async () =>{
        const body = {
            email: "testeteste.teste",
            password:"12345"
        }

        const result = await supertest(app).post("/log-in").send(body);
        expect(result.status).toEqual(400);
    })

})

