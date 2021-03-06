import supertest from 'supertest';
import app from '../src/app.js';
import connection from "../src/database.js";

beforeEach(async () => {
    await connection.query(`TRUNCATE products RESTART IDENTITY`);
    await connection.query(`TRUNCATE categories RESTART IDENTITY`);
    await connection.query(`TRUNCATE products_categories RESTART IDENTITY`);
    await connection.query(
        `INSERT INTO products 
        (title, price, "imageUrl") 
        VALUES ('Remédio mata-piolho', 46.50, 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132'),
        ('Coçador de Bigodes', 5.99, 'https://ae01.alicdn.com/kf/H312524278ed2491da8311324dd2b7bbd8/Gatos-escova-de-canto-gato-massagem-auto-groomer-pente-escova-gato-esfrega-o-rosto-com-um.jpg_Q90.jpg_.webp')`
    );
    await connection.query(
        `INSERT INTO categories 
        (name) VALUES ('gato'), ('remedio')`
    );
    await connection.query(
        `INSERT INTO products_categories 
        ("categoryId", "productId") VALUES (1, 1), (1,2), (2,1)`
    );
});

describe("GET /homepage?category=", () => {
    it("returns status 201 for successful request", async () =>{
        const result = await supertest(app).get("/homepage?category=remedio");
        expect(result.status).toEqual(201);
    });
    it("returns array of selected products for successful request", async () =>{
        const result = await supertest(app).get("/homepage?category=remedio");
        expect(result.body).toEqual([{'id': 1, 'title': 'Remédio mata-piolho', 'price': 'R$ 46,50', 'imageUrl': 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132'}]);
    });  
});

afterAll(() => {
    connection.end();
});