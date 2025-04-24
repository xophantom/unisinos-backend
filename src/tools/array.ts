export const getUniqueItemsByField = (array, key) =>
  array.filter((item, index, self) => index === self.findIndex((t) => t[key] === item[key]));
