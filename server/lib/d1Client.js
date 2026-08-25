export function getDatabase(env) {
  if (!env?.DB) {
    throw new Error("D1 database binding DB is missing.");
  }

  return env.DB;
}
