import * as context from "./context.js";

const pipeline = (interceptors) => (handler) => async (request) => {
  const scope = context.create(request);
  const dispatch = (index) => async () => {
    const interceptor = interceptors[index];
    if (!interceptor) {
      return handler(scope);
    }
    return interceptor(scope, dispatch(index + 1));
  };
  return dispatch(0)();
};

export {
  pipeline
};
