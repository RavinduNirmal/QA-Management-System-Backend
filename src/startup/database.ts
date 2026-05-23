import { createConnection } from "typeorm";
import { db } from "../infras/database/dbConfig";
import { initialUser } from "../infras/utils/utils";

export async function initializeDatabase() {
  // Connect MySQL
  await new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log("Database Connected!");
        resolve(true);
      }
    });
  });

  // Create TypeORM connection
  const connection = await createConnection();
  console.log("TypeORM Connection established");
  console.log("Loaded entities:", connection.entityMetadatas.map(e => e.name));

  // Initialize default user
  await initialUser();

  return connection;
}

export default initializeDatabase;