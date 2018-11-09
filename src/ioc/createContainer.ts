import 'reflect-metadata';
import { Container } from 'inversify';
import '../controllers/ClinicsController';
import { createDatabaseModule } from './createDatabaseModule';


export async function createContainer (config: any) {
  const container = new Container();

  await container.loadAsync(createDatabaseModule(config.database));

  return container;
}
