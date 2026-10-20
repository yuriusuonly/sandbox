import * as console from "./system/console.js";
import * as environment from "./system/environment.js";
import * as server from "./network/server.js";
import * as uri from "./system/uri.js";

const origin = uri.http(`${environment.PROTOCOL}://${environment.HOST}:${environment.PORT}`);
const location = uri.join(origin, environment.BASE_PATH);

console.info(`${environment.NAME}@${environment.VERSION} listening on ${location.href}`);
