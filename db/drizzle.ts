// Database connection disabled for demo mode
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// import * as schema from "./schema";

// const sql = neon(process.env.DATABASE_URL);
// const db = drizzle(sql, { schema });

// Mock db object for demo mode - returns empty query interface
const mockDb = {
  query: {} as any,
  insert: () => ({ values: () => Promise.resolve([]) }),
  update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) }),
  delete: () => Promise.resolve([]),
};

export default mockDb as any;
