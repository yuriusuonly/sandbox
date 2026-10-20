import * as request from "../requests/robots.request.js";
import * as status from "../network/status.js";

const content_type = "text/plain; charset=utf-8";

const respond = () => {
  return new Response(request.data(), {
    status: status.code.OK,
    headers: {
      "content-type": content_type
    }
  });
};

export {
  respond
};
