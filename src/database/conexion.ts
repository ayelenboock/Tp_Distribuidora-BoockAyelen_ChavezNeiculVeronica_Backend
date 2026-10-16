import mysql from 'mysql2/promise';
// Create the connection 

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'distribuidora',
  waitForConnections: true,
  connectionLimit: 10, //maximo de conectados a bd
  queueLimit: 0,
 
});

// Probamos que la conexion funcione al iniciar
try{
    const connection=await db.getConnection();
    console.log('Base de datos conectada con éxito');
    connection.release(); // Liberamos la conexion de prueba
}catch(error){
    console.error('Eroor al conectar a la base de datos',error.message);
}

export default db;