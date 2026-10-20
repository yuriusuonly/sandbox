const now = () => {
  return new Date();
};

const get_offset = (offsetMinutes) => {
  const absMin = Math.abs(offsetMinutes);
  const sign = offsetMinutes <= 0 ? '+' : '-';
  return `${sign}${pad(Math.floor(absMin / 60))}:${pad(absMin % 60)}`;
};

const pad = (n, width = 2) => String(n).padStart(width, '0');

const custom = (pattern, date = now()) => {
  const localOffsetMin = date.getTimezoneOffset();
  const localZ = get_offset(localOffsetMin);
  const utcZ = "+00:00";
  const tokens = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    sss: pad(date.getMilliseconds(), 3),
    z: localZ,
    Z: utcZ
  };
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss|sss|z|Z/g, (match) => tokens[match]);
}

export {
  now,
  custom
};
