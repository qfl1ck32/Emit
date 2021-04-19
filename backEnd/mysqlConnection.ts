import mysql from 'mysql'

export default class MySQLConnection {
    private connection: mysql.Connection;

    public static instance: MySQLConnection;
    
    public static getInstance(): MySQLConnection {
        if (MySQLConnection.instance == null)
            MySQLConnection.instance = new MySQLConnection();

        return MySQLConnection.instance;
    }

    private constructor() {
        this.connection = mysql.createConnection(process.env.DATABASE_URL)

        setInterval(() => {
            this.connection.query('SELECT 1')
        }, 5000)
        
    }

    public sendQuery = async (query: string, parametersToBind: Array <any>): Promise <Array <any> > => {
        return await new Promise((resolve, reject) => {
             this.connection.query(query, parametersToBind, (err, results, fields) => {
                if (err)
                    return reject(err)

                return resolve(results)
            })
        })
    }
}