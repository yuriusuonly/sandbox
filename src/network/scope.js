import * as environment from "../system/environment.js";
import * as context from "./context.js";
import * as status from "./status.js";

const root = {
  public: `/${environment.BASE_PATH}`,
  api: `/${environment.API_BASE_PATH}`
};

const match = (pathname) => {
  for (const [name, prefix] of Object.entries(root)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return name;
    }
  }
  return null;
};

const interceptor = async (scope, next) => {
  const name = match(scope.uri.pathname);
  if (!name) {
    return new Response(status.reason(status.code.FORBIDDEN), {
      status: status.code.FORBIDDEN
    });
  }
  context.set(scope, "boundary", name);
  context.set(scope, "path_name", scope.uri.pathname.slice(root[name].length) || "/");
  return next();
};

export {
  root,
  match,
  interceptor
};
