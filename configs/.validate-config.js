#!/usr/bin/env node

/**
 * Simple JSON config validator
 * Usage: node .validate-config.js path/to/config.json
 */

const fs = require("fs");
const path = require("path");

function validateConfig(filePath) {
  console.log(`🔍 Validating: ${filePath}`);

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, "utf8");
    const config = JSON.parse(content);

    // Required top-level fields
    const requiredFields = ["company", "landing", "campus", "jobs", "copy"];
    const missing = requiredFields.filter((field) => !config[field]);

    if (missing.length > 0) {
      console.error("❌ Missing required fields:", missing.join(", "));
      return false;
    }

    // Validate company
    if (!config.company.name || !config.company.primaryColor) {
      console.error("❌ Company must have name and primaryColor");
      return false;
    }

    // Validate color format
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(config.company.primaryColor)) {
      console.error("❌ primaryColor must be hex format (e.g., #FF5733)");
      return false;
    }

    // Validate jobs array
    if (!Array.isArray(config.jobs) || config.jobs.length === 0) {
      console.error("❌ jobs must be a non-empty array");
      return false;
    }

    // Check each job has required fields
    config.jobs.forEach((job, idx) => {
      if (!job.id || !job.title || !job.levels) {
        console.error(
          `❌ Job ${idx} missing required fields (id, title, levels)`
        );
        return false;
      }
    });

    console.log("✅ Config is valid!");
    return true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("❌ Invalid JSON syntax:", error.message);
    } else {
      console.error("❌ Error:", error.message);
    }
    return false;
  }
}

// Run validator
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node .validate-config.js path/to/config.json");
  process.exit(1);
}

const isValid = validateConfig(filePath);
process.exit(isValid ? 0 : 1);
