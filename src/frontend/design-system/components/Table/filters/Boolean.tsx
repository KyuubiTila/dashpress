import { FilterOperators, IColumnFilterBag } from "shared/types/data";
import { ISelectData } from "shared/types/options";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { fakeMessageDescriptor } from "translations/fake";
import { SimpleSelect } from "../../Form/FormSelect/Simple";
import { IFilterProps } from "./types";

export function FilterTableByBooleans({
  column: { filterValue, setFilter },
  bag,
}: IFilterProps<IColumnFilterBag<boolean>, ISelectData[]>) {
  const { _ } = useLingui();
  return (
    <SimpleSelect
      options={[
        {
          label: fakeMessageDescriptor(`--- ${_(msg`Select Value`)} ---`),
          value: "",
        },
        ...bag,
      ]}
      onChange={(value: string) => {
        setFilter({
          operator: FilterOperators.EQUAL_TO,
          value: value === "" ? undefined : value === "true",
        });
      }}
      width={0}
      ariaLabel="Select Boolean"
      fullWidth
      value={
        // eslint-disable-next-line no-nested-ternary
        filterValue?.value === undefined
          ? ""
          : filterValue?.value
          ? "true"
          : "false"
      }
    />
  );
}
