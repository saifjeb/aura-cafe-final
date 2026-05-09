const isDevelopment = process.env.NODE_ENV !== "production";

export const logger = {
  info: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
};
