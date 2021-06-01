import { connect, connection as conn, Connection } from 'mongoose'

export class Database {
    private static uri: string = 'mongodb://127.0.0.1/emit'
    private static instance: Database = null

    private Database() { }

    public static getInstance = () => {

        if (Database.instance == null) {
            Database.instance = new Database()

            connect(Database.uri, { useNewUrlParser: true, useUnifiedTopology: true }, error => {
                if (error)
                    throw new Error('Error when trying to connect to MongoDB: ' + error.message)
            })
        }
        
        return Database.instance
    }

    public connection = () => {
        return conn
    }
}