import pg from 'pg';
const { Pool } = pg;
const connection = new Pool({
    user: 'postgres',
    password: '35728892',
    host: 'localhost',
    port: 5432,
    database: 'anubis'
});
export default connection;