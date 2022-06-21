import {
  Breadcrumbs,
  DropDownMenu,
  DynamicLayout,
  Spacer,
  Stack,
  Text,
} from "@gothicgeeks/design-system";
import { IValueLabel } from "@gothicgeeks/design-system/dist/types";
import React, { ReactNode } from "react";
import { HardDrive, Icon } from "react-feather";
import { useEntitiesMenuItems } from "../../hooks/entity/entity.store";
import Head from "next/head";
import { useSiteConfig } from "../../hooks/app/site.config";
import { NAVIGATION_LINKS } from "../../lib/routing/links";

interface IProps {
  children: ReactNode;
  breadcrumbs: IValueLabel[];
  titleNeedsContext?: true;
  actionItems?: {
    label: string;
    onClick: () => void;
    IconComponent: Icon;
  }[];
}

export const AppLayout = ({
  children,
  breadcrumbs,
  titleNeedsContext,
  actionItems = [],
}: IProps) => {
  const entitiesMenuItems = useEntitiesMenuItems();

  const siteConfig = useSiteConfig();

  const homedBreadcrumb = [{ label: "Home", value: "/" }, ...breadcrumbs];

  const title =
    (titleNeedsContext
      ? homedBreadcrumb[homedBreadcrumb.length - 2]?.label + " - "
      : "") + homedBreadcrumb[homedBreadcrumb.length - 1]?.label;
  return (
    <DynamicLayout
      selectionView={[
        {
          title: "Tables",
          description: "Your models",
          icon: HardDrive,
          viewMenuItems: {
            ...entitiesMenuItems,
            data: (entitiesMenuItems.data || []).map(({ label, value }) => ({
              title: label,
              link: NAVIGATION_LINKS.ENTITY.TABLE(value),
            })),
          },
        },
        {
          title: "Dashboards",
          description: "Your models",
          icon: HardDrive,
          view: <>Demo View</>,
        },
        {
          title: "Settings",
          icon: HardDrive,
          link: NAVIGATION_LINKS.SETTINGS.DEFAULT,
        },
      ]}
    >
      <Head>
        <title>
          {title} - {siteConfig.name}
        </title>
      </Head>
      <Stack justify="space-between" align="center">
        <div>
          <Text>{title}</Text>
          <Breadcrumbs items={homedBreadcrumb} />
        </div>
        {/* Remove this logic on version update */}
        {actionItems.length > 0 && <DropDownMenu menuItems={actionItems} />}
      </Stack>
      <Spacer />
      {children}
    </DynamicLayout>
  );
};