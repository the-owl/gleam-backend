import { createContainer } from './ioc/createContainer';
import { createExpressServer } from './createExpressServer';


// tslint:disable:no-console
export async function createApp (config: any) {
  const container = await createContainer(config);
  console.log('Loaded database module.');
  const app = createExpressServer(container);

  await new Promise((resolve, reject) => {
    app.listen(config.http.port, (error: Error) => error ? reject(error) : resolve());
  });
  console.log('Listening at port ' + config.http.port);

  return app;
}
