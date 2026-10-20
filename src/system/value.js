import * as console from "./console.js";
import * as process from "./process.js";

const object_tag = (value) => Object.prototype.toString.call(value);

const string = (value) => {
  if (object_tag(value) !== "[object String]") {
    console.error(`Unexpected string value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const number = (value) => {
  if (object_tag(value) !== "[object Number]") {
    console.error(`Unexpected number value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const integer = (value) => {
  if (object_tag(value) !== "[object Number]" || !Number.isInteger(value)) {
    console.error(`Unexpected integer value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const decimal = (value) => {
  if (object_tag(value) !== "[object Number]" || Number.isInteger(value)) {
    console.error(`Unexpected decimal value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const boolean = (value) => {
  if (object_tag(value) !== "[object Boolean]") {
    console.error(`Unexpected boolean value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const array = (value) => {
  if (object_tag(value) !== "[object Array]") {
    console.error(`Unexpected array value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

const object = (value) => {
  if (object_tag(value) !== "[object Object]") {
    console.error(`Unexpected object value ${value}`);
    process.exit(process.code.FAILURE);
  }
  return value;
}

export {
  string,
  number,
  integer,
  decimal,
  boolean,
  array,
  object
};
