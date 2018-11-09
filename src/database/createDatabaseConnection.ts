import { createConnection } from 'typeorm';


export async function createDatabaseConnection (config: any) {
  return await createConnection(config);
}
