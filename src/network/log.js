import * as console from "../system/console.js";
import * as context from "./context.js";

const interceptor = async (scope, next) => {
  const location = `${scope.uri.host}${scope.uri.pathname}`;
  console.info(`→ ${scope.request.method} ${location}`);
  const response = await next();
  console.info(`← ${response.status} ${location} (${context.elapsed(scope)}ms)`);
  return response;
};

export {
  interceptor
};
