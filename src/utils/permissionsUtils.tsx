// Data types
import { Permission } from "src/utils/datatypes/globalDataTypes";
import { SelectOptionProps } from "src/components/layouts/SimpleSelector";
// Utils
import { convertApiObj } from "./ipaObjectUtils";

export const BIND_RULE_OPTIONS: SelectOptionProps[] = [
  { key: "permission", value: "permission" },
  { key: "all", value: "all" },
  { key: "anonymous", value: "anonymous" },
  { key: "self", value: "self" },
];

// Objects that share names with others but shouldn't be user-selectable
export const FILTERED_OBJECTS: readonly string[] = ["automember_default_group"];

export const GRANTED_RIGHTS_OPTIONS = [
  { value: "read", text: "read" },
  { value: "search", text: "search" },
  { value: "compare", text: "compare" },
  { value: "write", text: "write" },
  { value: "add", text: "add" },
  { value: "delete", text: "delete" },
  { value: "all", text: "all" },
];

export const asRecord = (
  element: Partial<Permission>,
  onElementChange: (element: Partial<Permission>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ipaObject = element as Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recordOnChange(ipaObject: Record<string, any>) {
    onElementChange(ipaObject as Permission);
  }

  return { ipaObject, recordOnChange };
};

const simpleValues = new Set([
  "cn",
  "ipapermbindruletype",
  "ipapermlocation",
  "ipapermtarget",
  "ipapermtargetto",
  "ipapermtargetfrom",
  "targetgroup",
  "type",
]);
const dateValues = new Set([]);

export function apiToPermission(
  apiRecord: Record<string, unknown>
): Permission {
  const converted = convertApiObj(
    apiRecord,
    simpleValues,
    dateValues
  ) as Partial<Permission>;

  return {
    ...createEmptyPermission(),
    ...converted,
    ipapermright: (apiRecord.ipapermright as string[]) || [],
    attrs: (apiRecord.attrs as string[]) || [],
    ipapermincludedattrmultivalued:
      (apiRecord.ipapermincludedattrmultivalued as string[]) || [],
    ipapermexcludedattrmultivalued:
      (apiRecord.ipapermexcludedattrmultivalued as string[]) || [],
    extratargetfilter: (apiRecord.extratargetfilter as string[]) || [],
    ipapermtargetfilter: (apiRecord.ipapermtargetfilter as string[]) || [],
    memberof: (apiRecord.memberof as string[]) || [],
  };
}

export function partialPermissionToPermission(
  partialPermission: Partial<Permission>
): Permission {
  return {
    ...createEmptyPermission(),
    ...partialPermission,
  };
}

export function createEmptyPermission(): Permission {
  return {
    cn: "",
    ipapermright: [],
    attrs: [],
    ipapermincludedattrmultivalued: [],
    ipapermexcludedattrmultivalued: [],
    ipapermbindruletype: "",
    ipapermlocation: "",
    extratargetfilter: [],
    ipapermtargetfilter: [],
    ipapermtarget: "",
    ipapermtargetto: "",
    ipapermtargetfrom: "",
    memberof: [],
    targetgroup: "",
    type: "",
  };
}
