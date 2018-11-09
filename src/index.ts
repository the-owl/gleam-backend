import { readConfig } from './readConfig';
import { createApp } from './createApp';


console.log('Starting...');
createApp(readConfig());
