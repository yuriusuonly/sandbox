import process from "node:process";

const code = {
  SUCCESS: 0,
  FAILURE: 1
};

const exit = (value) => {
  process.exit(value);
};

export {
  code,
  exit
};
