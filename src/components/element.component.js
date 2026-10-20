const text = (value) => {
  return String(value);
};

const attributes = (values) => {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join("");
};

const element = (name, values = {}, ...children) => {
  const open = `<${name}${attributes(values)}`;
  const content = children.flat().join("");
  if (content === "") {
    return `${open} />`;
  }
  return `${open}>${content}</${name}>`;
};

export {
  text,
  element
};
