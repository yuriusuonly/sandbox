import os from "node:os";

const type = {
  "linux": "Linux",
};

const platform = () => {
  return os.platform();
};

export {
  type,
  platform
};
