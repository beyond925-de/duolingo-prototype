#!/usr/bin/env node

/**
 * Export Sollich config from TypeScript to JSON
 * This is a one-time script to create the initial JSON config
 */

const fs = require("fs");
const path = require("path");

// Read the TypeScript config file
const configPath = path.join(__dirname, "../app/config.ts");
const configContent = fs.readFileSync(configPath, "utf8");

// Extract the config object (this is a hacky way but works for one-time migration)
// Remove the export statement and imports
let jsContent = configContent
  .replace(/^import .+$/gm, "")
  .replace(/^export const config = /m, "const config = ")
  .replace(/ as Job\[\]/g, "")
  .replace(/ as const/g, "");

// Evaluate the JavaScript to get the config object
const config = eval(`(function() {
  ${jsContent}
  return config;
})()`);

// Create the JSON structure
const jsonConfig = {
  company: config.company,
  landing: config.landing,
  campus: config.campus,
  jobs: config.jobs,
  copy: config.copy,
};

// Write to configs/sollich/config.json
const outputPath = path.join(__dirname, "../configs/sollich/config.json");
fs.writeFileSync(outputPath, JSON.stringify(jsonConfig, null, 2));

console.log("✅ Exported config to:", outputPath);
console.log(`📊 Jobs: ${jsonConfig.jobs.length}`);
console.log(
  `📝 Config size: ${(JSON.stringify(jsonConfig).length / 1024).toFixed(2)}KB`
);
