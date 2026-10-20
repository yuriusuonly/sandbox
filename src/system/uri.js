import url from "node:url";
import * as console from "./console.js";
import * as process from "./process.js";

const invalid = (location) => {
  console.error(`Invalid URI "${location}".`);
  process.exit(process.code.FAILURE);
};

const http = (location) => {
  try {
    const parsed = new URL(location);
    return {
      protocol: parsed.protocol.slice(0, -1),
      host: parsed.host,
      port: parsed.port,
      pathname: parsed.pathname,
      parameters: Object.fromEntries(parsed.searchParams),
      href: parsed.href
    };
  } catch {
    return invalid(location);
  }
};

const file = (location) => {
  try {
    return url.fileURLToPath(location);
  } catch {
    return invalid(location);
  }
};

const is_http = (value) => {
  return value.protocol === "http" || value.protocol === "https";
};

const is_file = (value) => {
  return value.protocol === "file";
};

const directory = (value) => {
  const location = value.href ?? value;
  return location.endsWith("/") ? location : `${location}/`;
};

const join = (base, ...segments) => {
  const combined = segments.reduce(
    (current, segment) => new URL(segment, directory(current)),
    new URL(directory(base))
  );
  return http(combined.href);
};

export {
  http,
  file,
  is_http,
  is_file,
  join
};
