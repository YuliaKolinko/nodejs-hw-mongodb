export function getEnvVariable(name) {
  const value = process.env[name];
  if (typeof value === 'undefined') {
    throw new Error(`Environment variable "${name}" is not defined`);
  }
  return value;
}
