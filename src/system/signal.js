import process from "node:process";
import os from "node:os";

const code = {
  SIGHUP,
  SIGINT,
  SIGQUIT,
  SIGTERM
} = os.constants.signals;

const signal_name = (value) => {
  return Object.keys(code).find(
    (key) => code[key] === value
  );
};

const on = (signal, callback) => {
  process.on(signal_name(signal), callback);
};

const off = (signal, callback) => {
  process.off(signal_name(signal), callback);
};

const remove = (signal) => {
  process.removeAllListeners(signal_name(signal));
};

export {
  code,
  on,
  off,
  remove
};
