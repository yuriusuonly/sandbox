import {test, expect} from "bun:test";
import * as uri from "./uri.js";

test("http parses location into parts", () => {
  const parsed = uri.http("http://localhost:3000/robots.txt?x=1&y=2");
  expect(parsed.protocol).toBe("http");
  expect(parsed.host).toBe("localhost:3000");
  expect(parsed.port).toBe("3000");
  expect(parsed.pathname).toBe("/robots.txt");
  expect(parsed.parameters).toEqual({x: "1", y: "2"});
});

test("http defaults port for standard protocol", () => {
  const parsed = uri.http("https://example.com/base");
  expect(parsed.protocol).toBe("https");
  expect(parsed.port).toBe("");
  expect(uri.is_http(parsed)).toBe(true);
});

test("file converts file uri to path", () => {
  const path = uri.file("file:///home/yuriusu/Documents/sandbox/src/index.js");
  expect(path).toBe("/home/yuriusu/Documents/sandbox/src/index.js");
});

test("is_file detects file protocol", () => {
  const parsed = uri.http("file:///tmp/x");
  expect(parsed.protocol).toBe("file");
  expect(uri.is_file(parsed)).toBe(true);
  expect(uri.is_http(parsed)).toBe(false);
});

test("join appends segments directory style", () => {
  const joined = uri.join("http://localhost:3000/api/", "v1", "users");
  expect(joined.href).toBe("http://localhost:3000/api/v1/users");
  expect(joined.pathname).toBe("/api/v1/users");
});

test("join accepts a parsed base", () => {
  const origin = uri.http("http://localhost:3000");
  expect(uri.join(origin, "sandbox").href).toBe("http://localhost:3000/sandbox");
});
