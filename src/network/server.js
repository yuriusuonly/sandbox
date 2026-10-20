import {serve} from "bun";
import * as environment from "../system/environment.js";
import * as log from "./log.js";
import * as middleware from "./middleware.js";
import * as route from "./route.js";
import * as scope from "./scope.js";
import * as status from "./status.js";

const interceptors = [
  log.interceptor,
  scope.interceptor
];

const handler = async (scope) => {
  const entry = route.resolve(scope);
  if (!entry) {
    return new Response(status.reason(status.code.NOT_FOUND), {
      status: status.code.NOT_FOUND
    });
  }
  return entry.respond(scope.request);
};

const fetch = middleware.pipeline(interceptors)(handler);

const server = serve({
  port: Number(environment.PORT),
  hostname: environment.HOST,
  fetch
});

export {
  server
};
