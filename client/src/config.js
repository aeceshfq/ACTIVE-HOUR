const env = process.env.NODE_ENV === 'production' ? 1 : 0;

console.log("env", env, process.env.NODE_ENV);

export const host = env === 1?"http://localhost:7575":"http://localhost:7575";