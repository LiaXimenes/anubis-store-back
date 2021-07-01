import supertest from 'supertest';
import app from '../src/app.js';
import connection from "../src/database.js";

let arrayOfProducts;

beforeEach(async () => {
    await connection.query(`DELETE FROM products`);
    await connection.query(
        `INSERT INTO products 
        (title, price, "imageUrl") 
        VALUES ('Remédio mata-piolho', 46.50, 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132'),
        ('Coçador de Bigodes', 5.99, 'https://ae01.alicdn.com/kf/H312524278ed2491da8311324dd2b7bbd8/Gatos-escova-de-canto-gato-massagem-auto-groomer-pente-escova-gato-esfrega-o-rosto-com-um.jpg_Q90.jpg_.webp')`
    );
    arrayOfProducts = await connection.query(
        `SELECT * FROM products`
    );
});

describe("GET /homepage", () => {
    it("returns status 201 for successful request", async () =>{
        const result = await supertest(app).get("/homepage");
        expect(result.status).toEqual(201);
    });
    it("returns array of products for successful request", async () =>{
        const result = await supertest(app).get("/homepage");
        expect(result.body).toEqual(arrayOfProducts.rows);
    });  
});

afterAll(() => {
    connection.end();
});