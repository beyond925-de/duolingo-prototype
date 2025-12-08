import { Beyond925App } from "./components/Beyond925App";
import { getCompanyConfig } from "./config-loader-client";

export default function HomePage() {
  const config = getCompanyConfig("sollich");
  return <Beyond925App config={config} companyId="sollich" />;
}
