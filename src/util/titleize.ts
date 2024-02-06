export const dashString = (str: string): string => {
  return str.replace(/:/g, "").replace(/\s+/g, "-");
};
