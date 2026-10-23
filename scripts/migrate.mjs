import fs from "fs";
import path from "path";
import pg from "pg";
const { Client } = pg;

// Simple helper to load .env.local if not already in process.env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function migrate() {
  loadEnv();

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL is not defined in your environment or .env.local file.");
    console.error("Please add DATABASE_URL=postgresql://postgres... to .env.local and retry.");
    process.exit(1);
  }

  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Connected successfully!");

  const schemaPath = path.resolve(process.cwd(), "supabase", "schema.sql");
  console.log(`Reading SQL schema from ${schemaPath}...`);
  const sql = fs.readFileSync(schemaPath, "utf-8");

  console.log("Running migration and seeding Butuan-Caraga listings...");
  await client.query(sql);

  console.log("Migration executed successfully!");

  // Verify created tables and seed rows
  const jobsRes = await client.query("SELECT count(*) as count FROM public.jobs;");
  const profilesRes = await client.query("SELECT count(*) as count FROM public.profiles;");

  console.log(`Verification:`);
  console.log(`- Profiles registered: ${profilesRes.rows[0].count}`);
  console.log(`- Jobs active in Caraga: ${jobsRes.rows[0].count}`);

  await client.end();
  console.log("Database migration complete!");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
