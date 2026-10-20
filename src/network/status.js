const code = Object.freeze({
  OK: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500
});

const text = Object.freeze({
  [code.OK]: "OK",
  [code.BAD_REQUEST]: "Bad Request",
  [code.FORBIDDEN]: "Forbidden",
  [code.NOT_FOUND]: "Not Found",
  [code.METHOD_NOT_ALLOWED]: "Method Not Allowed",
  [code.INTERNAL_SERVER_ERROR]: "Internal Server Error"
});

const reason = (value) => {
  return text[value] ?? text[code.INTERNAL_SERVER_ERROR];
};

export {
  code,
  text,
  reason
};
