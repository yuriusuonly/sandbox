import util from "node:util";
import console from "node:console";
import * as date from "./date.js";

const date_format = "YYYY-MM-DD HH:mm:ss z";

const format_options = {
  depth: null,
  colors: true,
  showHidden: false,
};

const label = {
  info: "ℹ️",
  warn: "⚠️",
  error: "❌"
}

const format = (value) => {
  const timestamp = date.custom(date_format);
  const raw = typeof value === "string" ? value : util.inspect(value, format_options);
  return `[${timestamp}] ${raw}`;
};

const info = (value) => {
  console.info(`${label.info} ${format(value)}`);
};

const warn = (value) => {
  console.warn(`${label.warn} ${format(value)}`);
};

const error = (value) => {
  const holder = {};
  Error.captureStackTrace(holder);
  const stack = holder.stack.split("\n").slice(1).join("\n");
  console.error(`${label.error} ${format(value)}`);
  console.error(stack);
};

export {
  info,
  warn,
  error
};
