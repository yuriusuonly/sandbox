import fs from "node:fs";

const remove = (location) => {
  fs.rmSync(location, {
    recursive: true,
    force: true
  });
};

const directory = (location) => {
  fs.mkdirSync(location, {
    recursive: true,
    force: true
  });
};

const file = (location) => {
  const fd = fs.openSync(location, "a");
  fs.closeSync(fd);
};

const read = (location) => {
  return fs.readFileSync(location);
};

const write = (location, content) => {
  return fs.writeFileSync(location, content);
};

const append = (location, content) => {
  fs.appendFileSync(location, content);
};

const text = (buffer) => {
  return buffer.toString("utf-8");
};

const json = (buffer) => {
  return JSON.parse(text(buffer));
};

export {
  remove,
  directory,
  file,
  read,
  write,
  append,
  text,
  json
};
