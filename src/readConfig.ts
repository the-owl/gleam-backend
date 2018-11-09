import { readFileSync, existsSync } from 'fs';
import { safeLoad } from 'js-yaml';
import * as path from 'path';
import { merge } from 'lodash';


const CONFIG_FILENAME = 'config.yaml';
const DEFAULT_CONFIG_FILENAME = 'defaults.yaml';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(PROJECT_ROOT, CONFIG_FILENAME);
const DEFAULT_CONFIG_PATH = path.join(PROJECT_ROOT, DEFAULT_CONFIG_FILENAME);

export function readConfig () {
  const defaultConfigText = readFileSync(DEFAULT_CONFIG_PATH, 'utf8');
  const defaultConfig = safeLoad(defaultConfigText);
  let userConfig = {};
  if (existsSync(CONFIG_PATH)) {
    const userConfigText = readFileSync(CONFIG_PATH, 'utf8');
    try {
      userConfig = safeLoad(userConfigText);
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error('Warning: failed to parse config.yaml. Proceeding as if was empty.');
    }
  }
  return merge(defaultConfig, userConfig);
}
