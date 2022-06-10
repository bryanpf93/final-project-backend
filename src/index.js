import { MongoClient } from "mongodb";
import {app} from './app.js'

const URI = "mongodb+srv://bryanpf93:verdeyxoco123@final-project-back.rpu5svp.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(URI);

async function start (){
    try {
        await client.connect(); // 1. conectamos con el cliente
       app.locals.ddbbClient = client; // 2. Lo guardamos en el locals para que se acceda desde las rutas
       app.listen(4563, () => console.log('Server on port 4563'))
    } catch (err) {
        console.err('Error en el servidor: ', err);
    }
}

async function stop (){
    console.log('Cerrando el servidor');
    await client.close(); // cerramos la conexxion con la BBDD
}

process.on('SIGINT', stop); // eventos del SO cuando hacemos ctrl+c
process.on('SIGTERM', stop);

start(); // llamamos a la funcion start que inicia todo (BBDD  y server de express)
