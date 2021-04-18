import mysql from 'mysql'

export default class Connection {
    private connection: mysql.Connection;

    public static instance: Connection;
    
    public static getInstance(): Connection {
        if (Connection.instance == null)
            Connection.instance = new Connection();

        return Connection.instance;
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