/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  api,
  Command,
  getBatchCommand,
  getCommand,
  BatchRPCResponse,
  FindRPCResponse,
  useGettingGenericQuery,
  BatchResponse,
} from "./rpc";
import { API_VERSION_BACKUP } from "../utils/utils";
import { cnType } from "src/utils/datatypes/globalDataTypes";

/**
 * User ID override-related endpoints: getIdViews
 *
 * API commands:
 * - idview_find: https://freeipa.readthedocs.io/en/latest/api/idview_find.html
 */
const extendedApi = api.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Retrieve the full list of ID views
     * @returns {FindRPCResponse} - Find response
     */
    getIdViews: build.query<FindRPCResponse, void>({
      query: () => {
        return getCommand({
          method: "idview_find",
          params: [[], { version: API_VERSION_BACKUP }],
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetIdViewsQuery } = extendedApi;
