import { AsyncContainerModule, interfaces } from 'inversify';
import { createDatabaseConnection } from '../database/createDatabaseConnection';
import { TYPES } from './types';
import { Clinic } from '../entity/Clinic';


export function createDatabaseModule (databaseConfig: any) {
  return new AsyncContainerModule(
    async (bind: interfaces.Bind) => {
      console.log('Connecting to database...');
      const db = await createDatabaseConnection({
        ...databaseConfig ,
        entities: [ Clinic ]
      });
      console.log('Connected.');
      bind(TYPES.DatabaseConnection).toConstantValue(db);
      bind(TYPES.ClinicRepository).toConstantValue(db.getRepository(Clinic));
    }
  );
}
