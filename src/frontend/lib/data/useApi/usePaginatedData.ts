import type { UseQueryResult } from "@tanstack/react-query";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { IPaginatedDataState, PaginatedData } from "shared/types/data";
import { useRouter } from "next/router";
import { ApiRequest } from "../makeRequest";
import { buildApiOptions } from "../_buildOptions";
import type { IUseApiOptions } from "../types";
import { getPaginatedDataCachekey } from "../constants/getQueryCacheKey";
import { tableDataParamsToQueryString } from "./tableDataParamsToQueryString";

export function usePaginatedData<T extends Record<string, unknown>>(
  endPoint: string,
  dataState: IPaginatedDataState<T>,
  options: IUseApiOptions<PaginatedData<T>>
): UseQueryResult<PaginatedData<T>> {
  const builtOptions = buildApiOptions(options);
  const router = useRouter();

  return useQuery<PaginatedData<T>>({
    queryKey: getPaginatedDataCachekey(endPoint, dataState),
    queryFn: async ({ signal }) => {
      return await ApiRequest.GET(
        endPoint + tableDataParamsToQueryString(dataState),
        signal,
        "Data could not be retrieved"
      );
    },
    enabled: router.isReady && builtOptions.enabled,
    placeholderData: keepPreviousData,
    ...builtOptions,
  });
}
