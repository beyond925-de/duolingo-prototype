import { CompanyConfig } from "@/app/types";
import fs from "fs";
import path from "path";

/**
 * Load a company config from the configs directory
 * @param companyId - The company identifier (folder name)
 * @returns The company configuration object
 */
export function loadCompanyConfig(companyId: string): CompanyConfig {
  const configPath = path.join(
    process.cwd(),
    "configs",
    companyId,
    "config.json"
  );

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Config not found for company: ${companyId} at ${configPath}`
    );
  }

  const configContent = fs.readFileSync(configPath, "utf8");
  const config = JSON.parse(configContent);

  return config;
}

/**
 * Get a list of all available company IDs
 * @returns Array of company folder names
 */
export function getAvailableCompanies(): string[] {
  const configsDir = path.join(process.cwd(), "configs");

  if (!fs.existsSync(configsDir)) {
    return [];
  }

  return fs
    .readdirSync(configsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

/**
 * Check if a company config exists
 * @param companyId - The company identifier
 * @returns boolean indicating if config exists
 */
export function companyConfigExists(companyId: string): boolean {
  const configPath = path.join(
    process.cwd(),
    "configs",
    companyId,
    "config.json"
  );
  return fs.existsSync(configPath);
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
