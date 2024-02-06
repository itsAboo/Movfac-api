export const isEmail = (email: string) => {
  return email.includes("@") && email.length >= 8;
};

export const isPassword = (password: string) => {
  return password.length > 5 && password.match(/^[a-zA-Z0-9]+$/);
};
