import { CompanyConfig } from "@/app/types";
import fs from "fs";
import path from "path";

/**
 * Find config file by slug
 * @param slug - The company slug
 * @returns Path to config file or null if not found
 */
function findConfigBySlug(slug: string): string | null {
  const configsDir = path.join(process.cwd(), "configs");

  if (!fs.existsSync(configsDir)) {
    return null;
  }

  const configDirs = fs
    .readdirSync(configsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of configDirs) {
    const configPath = path.join(configsDir, dir, "config.json");
    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, "utf8");
        const config = JSON.parse(configContent) as CompanyConfig;
        if (config.company.slug === slug) {
          return configPath;
        }
      } catch (error) {
        // Skip invalid configs
        continue;
      }
    }
  }

  return null;
}

/**
 * Load a company config from the configs directory by slug
 * Falls back to folder name for backward compatibility
 * @param companySlug - The company slug (or folder name for backward compatibility)
 * @returns The company configuration object
 */
export function loadCompanyConfig(companySlug: string): CompanyConfig {
  // First try to find by slug
  const configPathBySlug = findConfigBySlug(companySlug);
  if (configPathBySlug) {
    const configContent = fs.readFileSync(configPathBySlug, "utf8");
    const config = JSON.parse(configContent) as CompanyConfig;
    return config;
  }

  // Fallback to folder name for backward compatibility
  const configPath = path.join(
    process.cwd(),
    "configs",
    companySlug,
    "config.json"
  );

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Config not found for company slug: ${companySlug}`
    );
  }

  const configContent = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configContent) as CompanyConfig;

  return config;
}

/**
 * Get a list of all available company slugs
 * @returns Array of company slugs
 */
export function getAvailableCompanies(): string[] {
  const configsDir = path.join(process.cwd(), "configs");

  if (!fs.existsSync(configsDir)) {
    return [];
  }

  const configDirs = fs
    .readdirSync(configsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const slugs: string[] = [];

  for (const dir of configDirs) {
    const configPath = path.join(configsDir, dir, "config.json");
    if (fs.existsSync(configPath)) {
      try {
        const configContent = fs.readFileSync(configPath, "utf8");
        const config = JSON.parse(configContent) as CompanyConfig;
        if (config.company.slug) {
          slugs.push(config.company.slug);
        }
      } catch (error) {
        // Skip invalid configs
        continue;
      }
    }
  }

  return slugs;
}

/**
 * Check if a company config exists by slug
 * @param companySlug - The company slug
 * @returns boolean indicating if config exists
 */
export function companyConfigExists(companySlug: string): boolean {
  return findConfigBySlug(companySlug) !== null;
}

/**
 * Load config with fallback to default (Sollich)
 * Useful for development or when company is not specified
 */
export function loadConfigWithFallback(companyId?: string): {
  config: CompanyConfig;
  companyId: string;
} {
  const targetCompany = companyId || "sollich";

  try {
    const config = loadCompanyConfig(targetCompany);
    return { config, companyId: targetCompany };
  } catch (error) {
    console.warn(
      `Failed to load config for ${targetCompany}, falling back to sollich`
    );
    const config = loadCompanyConfig("sollich");
    return { config, companyId: "sollich" };
  }
}
