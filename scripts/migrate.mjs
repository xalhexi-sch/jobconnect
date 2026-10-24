import fs from "fs";
import path from "path";
import pg from "pg";
const { Client } = pg;

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

async function migrate() {
  loadEnv();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("ERROR: DATABASE_URL is not defined in your environment or .env.local file.");
    process.exit(1);
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  await client.query(
    "create table if not exists public.schema_migrations (name text primary key, applied_at timestamptz not null default now())"
  );
  const { rows } = await client.query("select name from public.schema_migrations");
  const applied = new Set(rows.map((r) => r.name));

  const dir = path.resolve(process.cwd(), "supabase", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    console.log(`Applying ${file}...`);
    try {
      await client.query("begin");
      await client.query(fs.readFileSync(path.join(dir, file), "utf-8"));
      await client.query("insert into public.schema_migrations(name) values ($1)", [file]);
      await client.query("commit");
    } catch (err) {
      await client.query("rollback");
      console.error(`Migration ${file} failed:`, err);
      await client.end();
      process.exit(1);
    }
  }

  console.log("Database is up to date.");
  await client.end();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
