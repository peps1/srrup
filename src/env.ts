import { config } from "dotenv";
import * as utils from "./utils.ts";

// Load .env file
config({ path: `${utils.configFolder}/.env` });
