import pg from 'pg';

const { Pool } = pg;

let databaseConfig = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1995",
    database: "anubis",
}

if(process.env.NODE_ENV === "production"){
    databaseConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }

}

const connection = new Pool(databaseConfig);

export default connection;