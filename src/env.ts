
import { config } from 'dotenv'
import * as utils from './utils';

// Load .env file
config({path: `${utils.configFolder}/.env`})