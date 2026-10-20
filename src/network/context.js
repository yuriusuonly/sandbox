import * as date from "../system/date.js";
import * as uri from "../system/uri.js";

const create = (request) => ({
  request,
  uri: uri.http(request.url),
  created_at: date.now(),
  state: {}
});

const set = (context, key, value) => {
  context.state[key] = value;
  return context;
};

const get = (context, key) => {
  return context.state[key];
};

const elapsed = (context) => {
  return date.now().getTime() - context.created_at.getTime();
};

export {
  create,
  set,
  get,
  elapsed
};
