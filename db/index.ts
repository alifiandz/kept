/**
 * Database access is intentionally not initialized in the UI bundle.
 * The approved Webuzo deployment will supply a server-only MySQL adapter
 * using db/mysql-schema.sql and environment variables stored outside git.
 */
export function getDb(): never {
  throw new Error("Kept database adapter is not configured. Do not enable shared writes before the Webuzo MySQL connection and server-side session layer are installed.");
}
