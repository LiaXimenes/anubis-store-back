import supertest from 'supertest';
import app from '../src/app.js';
import connection from "../src/database.js";

beforeEach(async () => {
    await connection.query(`TRUNCATE products RESTART IDENTITY`);
    await connection.query(`TRUNCATE sessions RESTART IDENTITY`);
    await connection.query(`TRUNCATE cart RESTART IDENTITY`);
    await connection.query(
        `INSERT INTO products 
        (title, price, "imageUrl") 
        VALUES ('Remédio mata-piolho', 46.50, 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132'),
        ('Coçador de Bigodes', 5.99, 'https://ae01.alicdn.com/kf/H312524278ed2491da8311324dd2b7bbd8/Gatos-escova-de-canto-gato-massagem-auto-groomer-pente-escova-gato-esfrega-o-rosto-com-um.jpg_Q90.jpg_.webp'),
        ('Remédio assusta-piolho', 12.50, 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132')`
    );
    await connection.query(
        `INSERT INTO sessions 
        ("userId", token) VALUES (1, 'tokenvalido'), (2, 'outrotoken')`
    );
    await connection.query(
        `INSERT INTO cart
        ("sessionId", "productId") VALUES (1, 1), (1,2)`
    );
});

describe("POST /cart", () => {
    const body = {productId: 1}
    it("returns status 201 for successful request", async () => {
        const result = await supertest(app).post("/cart").send(body).set("authorization", "bearer tokenvalido");
        expect(result.status).toEqual(200);
    });
    it("returns status 401 for fail request", async () => {
        const result = await supertest(app).post("/cart").send(body);
        expect(result.status).toEqual(401);
    })
});


describe("GET /cart", () => {
    it("returns status 201 for successful request", async () =>{
        const result = await supertest(app).get("/cart").set("authorization", "bearer tokenvalido");
        expect(result.status).toEqual(201);
    });
    it("returns array of selected products for successful request", async () =>{
        const result = await supertest(app).get("/cart").set("authorization", "bearer tokenvalido");
        expect(result.body).toEqual([{'id': 1, 'title': 'Remédio mata-piolho', 'price': 'R$ 46,50', 'imageUrl': 'https://www.petlove.com.br/images/products/227448/product/Antipulgas_e_Carrapatos_Frontline_Plus_para_Gatos_3105713.jpg?1597405132', 'cartId': 1},
        {'id': 2, 'title': 'Coçador de Bigodes', 'price': 'R$ 5,99', 'imageUrl': 'https://ae01.alicdn.com/kf/H312524278ed2491da8311324dd2b7bbd8/Gatos-escova-de-canto-gato-massagem-auto-groomer-pente-escova-gato-esfrega-o-rosto-com-um.jpg_Q90.jpg_.webp', 'cartId': 2}]);
    });  
});

describe("DELETE /cart", () => {
    it("returns status 201 for successful request", async () => {
        const result = await supertest(app).delete("/cart").set("autorization")
    })
})


afterAll(() => {
    connection.end();
});