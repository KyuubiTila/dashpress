import { ISingularPlural } from "shared/types/config";
import { IFileUploadSettings } from "shared/types/file";
import { BaseAppConfigurationKeys } from "./base-types";
import {
  PortalAppConfigurationKeys,
  PORTAL_APP_CONFIGURATION_CONFIG,
} from "./portal";
import { DEFAULT_SYSTEM_SETTINGS } from "./system";
import { IAppConfigurationBag } from "./types";

export type AppConfigurationKeys =
  | BaseAppConfigurationKeys
  | PortalAppConfigurationKeys;

export const APP_CONFIGURATION_CONFIG: Record<
  AppConfigurationKeys,
  IAppConfigurationBag
> = {
  ...PORTAL_APP_CONFIGURATION_CONFIG,
  hidden_entity_table_columns: {
    label: "Table Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_create_columns: {
    label: "Create Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },

  hidden_entity_update_columns: {
    label: "Update Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_details_columns: {
    label: "Details Columns Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_columns_labels: {
    label: "Column Labels Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_columns_types: {
    label: "Column Types Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_validations: {
    label: "Validations",
    requireEntity: true,
    defaultValue: {},
  },
  entity_selections: {
    label: "Selections Settings",
    requireEntity: true,
    defaultValue: {},
  },
  entity_diction: {
    label: "Diction Settings",
    requireEntity: true,
    defaultValue: { singular: "", plural: "" } as ISingularPlural,
  },
  entity_form_extension: {
    label: "Form Scripts",
    requireEntity: true,
    defaultValue: {
      fieldsState: "",
      beforeSubmit: "",
    },
  },
  file_upload_settings: {
    label: "File Uploads Settings",
    defaultValue: {
      defaultMaxFileSizeInMB: 5,
      fileNameFormat: "{{random_letters}}-{{file_name}}-{{file_extension}}",
      filePathFormat: "/uploads/{{entity}}/{{current_date}}",
    } as IFileUploadSettings,
  },
  entity_presentation_script: {
    label: "Presentation Scripts",
    requireEntity: true,
    defaultValue: {
      script: "",
    },
  },
  entity_fields_orders: {
    label: "Fields Order",
    requireEntity: true,
    defaultValue: [],
  },
  entity_crud_settings: {
    label: "CRUD Settings",
    requireEntity: true,
    defaultValue: {
      create: true,
      details: true,
      table: true,
      update: true,
      delete: true,
    },
  },
  entity_views: {
    label: "Views Settings",
    requireEntity: true,
    defaultValue: [],
  },
  entity_relations_order: {
    label: "Relations Order",
    requireEntity: true,
    defaultValue: [],
  },
  hidden_entity_relations: {
    label: "Enabled Relations",
    requireEntity: true,
    defaultValue: [],
  },
  entity_relation_template: {
    label: "Relation Template",
    requireEntity: true,
    defaultValue: { format: "", fields: [] },
  },
  entity_relations_labels: {
    label: "Relation Labels",
    requireEntity: true,
    defaultValue: {},
  },
  disabled_entities: {
    label: "Enabled Entities Settings",
    defaultValue: [],
  },
  disabled_menu_entities: {
    label: "Menu Settings",
    defaultValue: [],
  },
  menu_entities_order: {
    label: "Menu Settings",
    defaultValue: [],
  },
  default_date_format: {
    label: "Date Format",
    defaultValue: "do MMM yyyy, h:MM aa",
  },
  system_settings: {
    label: "System Settings",
    defaultValue: DEFAULT_SYSTEM_SETTINGS,
  },
  theme_color: {
    label: "Theme Settings",
    guest: true,
    defaultValue: {
      primary: "#4b38b3",
      primaryDark: "#8c68cd",
    },
  },
  site_settings: {
    label: "Site Settings",
    guest: true,
    defaultValue: {
      name: "DashPress",
      fullLogo: "/assets/images/full-logo.png",
      homeLink: "https://dashpress.io",
      logo: "/assets/images/logo.png",
    },
  },
};
