import {env} from "node:process";
import * as console from "./console.js";
import * as process from "./process.js";

const environment_variable = (name) => {
  const value = env[name];
  if (!value || value.trim() === "") {
    console.error(`Environment variable "${name}" not defined.`);
    process.exit(process.code.FAILURE);
  }
  return value;
};

const NAME = environment_variable("NAME");

const DESCRIPTION = environment_variable("DESCRIPTION");

const VERSION = environment_variable("VERSION");

const PROTOCOL = environment_variable("PROTOCOL");

const HOST = environment_variable("HOST");

const PORT = environment_variable("PORT");

const BASE_PATH = environment_variable("BASE_PATH");

const API_BASE_PATH = environment_variable("API_BASE_PATH");

export {
  NAME,
  DESCRIPTION,
  VERSION,
  PROTOCOL,
  HOST,
  PORT,
  BASE_PATH,
  API_BASE_PATH
};
