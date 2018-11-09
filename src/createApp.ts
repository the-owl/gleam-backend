import * as express from 'express';
import { attachRoutes } from './attachRoutes';
import { createConnection } from 'typeorm';


export async function createApp (config: any) {
  const app = express();

  const connection = await createConnection(config.database);
  attachRoutes(app);

  await new Promise((resolve, reject) => {
    app.listen(config.port, (error: Error) => error ? reject(error) : resolve());
  });
}
