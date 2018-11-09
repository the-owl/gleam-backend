import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';


export function createExpressServer (container: Container) {
  const server = new InversifyExpressServer(container);
  return server.build();
}
