import * as robots_request from "../requests/robots.request.js";
import * as robots_response from "../responses/robots.response.js";
import * as context from "./context.js";

const mapping = {
  [robots_request.boundary]: {
    [robots_request.path_name]: {
      method: robots_request.method,
      respond: robots_response.respond
    }
  }
};

const resolve = (current) => {
  const name = context.get(current, "boundary");
  const path_name = context.get(current, "path_name");
  const boundary = mapping[name];
  if (!boundary) {
    return null;
  }
  const entry = boundary[path_name];
  if (!entry) {
    return null;
  }
  if (entry.method !== current.request.method) {
    return null;
  }
  return entry;
};

export {
  mapping,
  resolve
};
