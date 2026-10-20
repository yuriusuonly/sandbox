import path from "node:path";
import fs from "node:fs";

const join = (...segments) => {
  return path.join(...segments);
};

const extension = (location) => {
  return path.extname(location);
};

const name = (location) => {
  return path.basename(location);
};

const parent = (location) => {
  return path.dirname(location);
};

const is_existing = (location) => {
  return fs.existsSync(location);
};

const is_file = (location) => {
  try {
    return fs.statSync(location).isFile();
  } catch {
    return false;
  }
};

const is_directory = (location) => {
  try {
    return fs.statSync(location).isDirectory();
  } catch {
    return false;
  }
};

export {
  join,
  extension,
  name,
  parent,
  is_existing,
  is_file,
  is_directory
};
