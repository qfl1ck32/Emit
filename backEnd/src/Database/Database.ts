import { connect, connection as conn, Connection } from "mongoose";

export class Database {
  private static uri: string = "mongodb://127.0.0.1/emit";
  private static instance: Database = null;

  private constructor() {}

  public static getInstance = () => {
    if (Database.instance == null) {
      Database.instance = new Database();

      const settings = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      };

      connect(Database.uri, settings, (error) => {
        if (error)
          throw new Error(
            "Error when trying to connect to MongoDB: " + error.message
          );
      });
    }

    return Database.instance;
  };

  public connection = () => {
    return conn;
  };
}
