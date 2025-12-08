import { CompanyConfig } from "./types";

// Import all available configs
import sollichConfig from "../configs/sollich/config.json";
import techflowConfig from "../configs/techflow/config.json";

// Map of company IDs to their configs
const configMap: Record<string, CompanyConfig> = {
  sollich: sollichConfig as CompanyConfig,
  techflow: techflowConfig as CompanyConfig,
};

/**
 * Get a company config by ID
 * Falls back to sollich if not found
 */
export function getCompanyConfig(companyId: string): CompanyConfig {
  return configMap[companyId] || configMap.sollich;
}

/**
 * Get list of available company IDs
 */
export function getAvailableCompanies(): string[] {
  return Object.keys(configMap);
}
