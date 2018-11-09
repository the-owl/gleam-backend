// used for deployment. Waits for database until available
// tslint:disable:no-console
import * as retry from 'async-retry';
import { readConfig } from './readConfig';
import { createDatabaseConnection } from './database/createDatabaseConnection';


retry(async () => {
  const config = readConfig();
  console.log('Attempting to connect...');
  try {
    await createDatabaseConnection(config.database);
  } catch (error) {
    console.log('Failed.', error);
    throw error;
  }
}, {
  factor: 1.3,
  retries: 15
}).then(() => {
  console.log('Connected.');
  process.exit(0);
}).catch((error: Error) => {
  console.error('Failed to establish database connection', error);
  process.exit(1);
});
