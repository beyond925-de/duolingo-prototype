import { Beyond925App } from "../components/Beyond925App";
import { loadCompanyConfig } from "@/lib/config-loader";
import { redirect } from "next/navigation";

export default function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  const companyId = params.company;

  // Try to load config, redirect to not-found if it doesn't exist
  let config;
  try {
    config = loadCompanyConfig(companyId);
  } catch (error) {
    redirect("/not-found");
  }

  return <Beyond925App config={config} companyId={companyId} />;
}
