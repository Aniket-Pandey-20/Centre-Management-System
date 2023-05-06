//We connect to database in this way
import pg from 'pg';
import { user, host, database, password, port } from './dbConfig.js';

const Client = pg.Client;

const client = new Client({
  user,
  host,
  database,
  password,
  port,
});
 
client.connect(()=>{
    try {
        console.log("Connected");
    } catch (error) {
        console.log(error);
    }
});
export {client};
