import { CompanyConfig } from "@/app/types";
import fs from "fs";
import path from "path";

/**
 * Check if a config is published (defaults to true if state is not set)
 * @param config - The company config
 * @returns boolean indicating if config is published
 */
function isConfigPublished(config: CompanyConfig): boolean {
  // Default to published if state is not specified (backward compatibility)
  return config.state === undefined || config.state === "published";
}

/**
 * Find config file by slug
 * @param slug - The company slug
 * @param includeUnpublished - Whether to include unpublished configs (default: false)
 * @returns Path to config file or null if not found
 */
function findConfigBySlug(slug: string, includeUnpublished: boolean = false): string | null {
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
          // Only return if published or if includeUnpublished is true
          if (includeUnpublished || isConfigPublished(config)) {
            return configPath;
          }
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
 * Only loads published configs by default
 * @param companySlug - The company slug (or folder name for backward compatibility)
 * @param includeUnpublished - Whether to include unpublished configs (default: false)
 * @returns The company configuration object
 * @throws Error if config is not found or is unpublished (unless includeUnpublished is true)
 */
export function loadCompanyConfig(companySlug: string, includeUnpublished: boolean = false): CompanyConfig {
  // First try to find by slug
  const configPathBySlug = findConfigBySlug(companySlug, includeUnpublished);
  if (configPathBySlug) {
    const configContent = fs.readFileSync(configPathBySlug, "utf8");
    const config = JSON.parse(configContent) as CompanyConfig;
    
    // Double-check published status if not including unpublished
    if (!includeUnpublished && !isConfigPublished(config)) {
      throw new Error(
        `Config for company slug "${companySlug}" is not published`
      );
    }
    
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

  // Check published status if not including unpublished
  if (!includeUnpublished && !isConfigPublished(config)) {
    throw new Error(
      `Config for company slug "${companySlug}" is not published`
    );
  }

  return config;
}

/**
 * Get a list of all available company slugs
 * Only returns published configs by default
 * @param includeUnpublished - Whether to include unpublished configs (default: false)
 * @returns Array of company slugs
 */
export function getAvailableCompanies(includeUnpublished: boolean = false): string[] {
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
          // Only include if published or if includeUnpublished is true
          if (includeUnpublished || isConfigPublished(config)) {
            slugs.push(config.company.slug);
          }
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
 * Only checks published configs by default
 * @param companySlug - The company slug
 * @param includeUnpublished - Whether to include unpublished configs (default: false)
 * @returns boolean indicating if config exists
 */
export function companyConfigExists(companySlug: string, includeUnpublished: boolean = false): boolean {
  return findConfigBySlug(companySlug, includeUnpublished) !== null;
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
