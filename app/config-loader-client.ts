import { CompanyConfig } from "./types";

// Import all available configs
import sollichConfig from "../configs/sollich/config.json";
import techflowConfig from "../configs/techflow/config.json";
import wagoConfig from "../configs/wago/config.json";

// Map of company IDs to their configs
const configMap: Record<string, CompanyConfig> = {
  sollich: sollichConfig as CompanyConfig,
  techflow: techflowConfig as CompanyConfig,
  wago: wagoConfig as CompanyConfig,
};

/**
 * Check if a company exists
 */
export function companyExists(companyId: string): boolean {
  return companyId in configMap;
}

/**
 * Get a company config by ID
 * Returns null if not found (no fallback)
 */
export function getCompanyConfig(companyId: string): CompanyConfig | null {
  return configMap[companyId] || null;
}

/**
 * Get list of available company IDs
 */
export function getAvailableCompanies(): string[] {
  return Object.keys(configMap);
}
