import * as io from "../system/io.js";
import * as path from "../system/path.js";

const method = "GET";

const path_name = "/robots.txt";

const boundary = "public";

const asset = path.join(import.meta.dir, "../assets/txt/robots.txt");

const data = () => {
  return io.text(io.read(asset));
};

export {
  method,
  path_name,
  boundary,
  data
};
