#!/usr/bin/env ts-node

/**
 * Sync JSON configs to TypeScript
 * This script helps integrate JSON configs created by non-technical team members
 *
 * Usage:
 *   pnpm tsx scripts/sync-config.ts sollich
 *   pnpm tsx scripts/sync-config.ts all
 */

import fs from "fs";
import path from "path";

const CONFIGS_DIR = path.join(process.cwd(), "configs");
const OUTPUT_DIR = path.join(process.cwd(), "app/configs");

function syncConfig(companyId: string) {
  console.log(`📦 Syncing config for: ${companyId}`);

  const configPath = path.join(CONFIGS_DIR, companyId, "config.json");

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config not found: ${configPath}`);
    return false;
  }

  try {
    // Read JSON config
    const jsonContent = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(jsonContent);

    // Create TypeScript file
    const tsContent = `// Auto-generated from configs/${companyId}/config.json
// Do not edit directly - edit the JSON file and run: pnpm sync-config ${companyId}

import { CompanyConfig } from "@/app/types";

export const ${companyId}Config: CompanyConfig = ${JSON.stringify(config, null, 2)} as const;
`;

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write TypeScript file
    const outputPath = path.join(OUTPUT_DIR, `${companyId}.ts`);
    fs.writeFileSync(outputPath, tsContent);

    console.log(`✅ Synced to: ${outputPath}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Error syncing ${companyId}:`, error.message);
    return false;
  }
}

function syncAllConfigs() {
  console.log("📦 Syncing all configs...\n");

  const companies = fs
    .readdirSync(CONFIGS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let successCount = 0;
  let failCount = 0;

  for (const company of companies) {
    if (syncConfig(company)) {
      successCount++;
    } else {
      failCount++;
    }
    console.log("");
  }

  console.log(`\n📊 Summary: ${successCount} succeeded, ${failCount} failed`);
}

// Main
const companyId = process.argv[2];

if (!companyId || companyId === "--help" || companyId === "-h") {
  console.log(`
Usage: pnpm tsx scripts/sync-config.ts <company-id>
       pnpm tsx scripts/sync-config.ts all

Examples:
  pnpm tsx scripts/sync-config.ts sollich
  pnpm tsx scripts/sync-config.ts all

This script converts JSON configs to TypeScript files for use in the app.
  `);
  process.exit(0);
}

if (companyId === "all") {
  syncAllConfigs();
} else {
  const success = syncConfig(companyId);
  process.exit(success ? 0 : 1);
}
