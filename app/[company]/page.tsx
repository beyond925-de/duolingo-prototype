import { Beyond925App } from "../components/Beyond925App";
import { getCompanyConfig } from "../config-loader-client";

export default function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  const config = getCompanyConfig(params.company);
  const companyId = params.company;

  return <Beyond925App config={config} companyId={companyId} />;
}
