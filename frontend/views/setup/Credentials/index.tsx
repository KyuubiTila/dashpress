import React from "react";
import { ComponentIsLoading } from "@gothicgeeks/design-system";
import { useSetupCheck } from "frontend/hooks/setup/setup.store";
import { AuthLayout } from "frontend/_layouts/guest";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { CredentialsSetupForm } from "./Form";
import { useSetupCredentialsMutation } from "../setup.store";

export function CredentialsSetup() {
  const setupCredentialsMutation = useSetupCredentialsMutation();

  const isChecking = useSetupCheck([
    {
      key: "hasDbCredentials",
      value: true,
      url: NAVIGATION_LINKS.SETUP.USER,
    },
  ]);

  if (isChecking) {
    return <ComponentIsLoading />;
  }

  return (
    <AuthLayout
      title="Setup DB crendentials"
      subTitle="Enter the crendentials of the data you want to manage"
    >
      <CredentialsSetupForm onSubmit={setupCredentialsMutation.mutateAsync} />
    </AuthLayout>
  );
}
