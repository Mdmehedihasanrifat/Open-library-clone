import  {Pool, PoolClient} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client: any, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err: Error, result: any) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('Connection established:', result.rows);
    });
  });

export default pool;
