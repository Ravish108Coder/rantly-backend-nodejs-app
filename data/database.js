import mysql from 'mysql';
const connectToMySql = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root_root',
        database: 'rantly'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            throw(err, null);
        } else {
            console.log('Connected to MySQL');
            console.log(`Database is: ${connection.config.database}`);
        }
    });
    return connection;
};

export { connectToMySql };