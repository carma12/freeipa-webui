import React from "react";
// PatternFly
import {
  Button,
  Pagination,
  PaginationVariant,
  TextInput,
} from "@patternfly/react-core";
// Components
import MemberOfToolbar from "../MemberOf/MemberOfToolbar";
import { AvailableItems } from "../MemberOf/MemberOfAddModal";
import MemberOfDeleteModal from "../MemberOf/MemberOfDeleteModal";
import MemberTable from "./MemberTable";
// Data types
import { UserGroup, UserIDOverride } from "src/utils/datatypes/globalDataTypes";
// Hooks
import useAlerts from "src/hooks/useAlerts";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
// RPC
import { ErrorResult } from "src/services/rpc";

import {
  MemberPayload,
  useAddAsMemberMutation,
  useRemoveAsMemberMutation,
} from "src/services/rpcUserGroups";
import { API_VERSION_BACKUP, paginate } from "src/utils/utils";
import { apiToUserIDOverride } from "src/utils/userIdOverrideUtils";

interface PropsToMembersUserIDOverrides {
  entity: Partial<UserGroup>;
  id: string;
  from: string;
  isDataLoading: boolean;
  onRefreshData: () => void;
  member_idoverrideuser: string[];
  memberindirect_idoverrideuser?: string[];
  membershipDisabled?: boolean;
}

const MembersUserIDOverrides = (props: PropsToMembersUserIDOverrides) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  const membershipDisabled =
    props.membershipDisabled === undefined ? false : props.membershipDisabled;

  // Get parameters from URL
  const {
    page,
    setPage,
    perPage,
    setPerPage,
    searchValue,
    setSearchValue,
    membershipDirection,
    setMembershipDirection,
  } = useListPageSearchParams();

  // Other states
  const [idOverridesSelected, setIdOverridesSelected] = React.useState<
    string[]
  >([]);

  // Loaded user ID overrides based on paging and member attributes
  const [idOverrides, setIdOverrides] = React.useState<UserIDOverride[]>([]);

  // Choose the correct user ID overrides based on the membership direction
  const member_idoverrideuser = props.member_idoverrideuser || [];
  const memberindirect_idoverrideuser =
    props.memberindirect_idoverrideuser || [];
  let idOverrideNames =
    membershipDirection === "direct"
      ? member_idoverrideuser
      : memberindirect_idoverrideuser;
  idOverrideNames = [...idOverrideNames];

  const getIdOverridesNameToLoad = (): string[] => {
    let toLoad = [...idOverrideNames];
    toLoad.sort();

    // Filter by search
    if (searchValue) {
      toLoad = toLoad.filter((name) =>
        name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply paging
    toLoad = paginate(toLoad, page, perPage);

    return toLoad;
  };

  const [idOverrideNamesToLoad, setIdOverrideNamesToLoad] = React.useState<
    string[]
  >(getIdOverridesNameToLoad());

  // Load User ID overrides
  const fullIdOverridesQuery = useGetIdOverridesInfoByUidQuery(
    idOverrideNamesToLoad
  );

  // Refresh User ID overrides
  React.useEffect(() => {
    const idOverridesNames = getIdOverrideNameToLoad();
    setIdOverrideNamesToLoad(idOverridesNames);
  }, [props.entity, membershipDirection, searchValue, page, perPage]);

  React.useEffect(() => {
    if (idOverrideNamesToLoad.length > 0) {
      fullIdOverridesQuery.refetch();
    }
  }, [idOverrideNamesToLoad]);

  // Update User ID overrides
  React.useEffect(() => {
    if (fullIdOverridesQuery.data && !fullIdOverridesQuery.isFetching) {
      setIdOverrides(fullIdOverridesQuery.data);
    }
  }, [fullIdOverridesQuery.data, fullIdOverridesQuery.isFetching]);

  // Get type of the entity to show as text
  const getEntityType = () => {
    if (props.from === "user-groups") {
      return "user group";
    } else {
      // Return 'group' as default
      return "group";
    }
  };

  // Computed "states"
  const someItemSelected = idOverridesSelected.length > 0;
  const showTableRows = idOverrides.length > 0;
  const entityType = getEntityType();
  const idOverrideColumnNames = ["User to override"];
  const idOverrideProperties = ["uid"];

  // Dialogs and actions
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Buttons functionality
  const isRefreshButtonEnabled =
    !fullIdOverridesQuery.isFetching && !props.isDataLoading;
  const isDeleteEnabled =
    someItemSelected && membershipDirection !== "indirect";
  const isAddButtonEnabled =
    membershipDirection !== "indirect" && isRefreshButtonEnabled;

  // Add new member to 'IdOverride'
  // API calls
  const [addMemberToIdOverride] = useAddAsMemberMutation();
  const [removeMembersFromIdOverrides] = useRemoveAsMemberMutation();
  const [adderSearchValue, setAdderSearchValue] = React.useState("");
  const [availableIdOverrides, setAvailableIdOverrides] = React.useState<
    UserIDOverride[]
  >([]);
  const [availableItems, setAvailableItems] = React.useState<AvailableItems[]>(
    []
  );

  // Load available User ID overrides, delay the search for opening the modal
  const idOverridesQuery = useGettingIdOverridesQuery({
    search: adderSearchValue,
    apiVersion: API_VERSION_BACKUP,
    sizelimit: 100,
    startIdx: 0,
    stopIdx: 100,
  });

  // Trigger available User ID overrides search
  React.useEffect(() => {
    if (showAddModal) {
      idOverridesQuery.refetch();
    }
  }, [showAddModal, adderSearchValue, props.entity]);

  // Update available User ID overrides
  React.useEffect(() => {
    if (idOverridesQuery.data && !idOverridesQuery.isFetching) {
      // transform data to User ID overrides
      const count = idOverridesQuery.data.result.count;
      const results = idOverridesQuery.data.result.results;
      let items: AvailableItems[] = [];
      const avalIdOverrides: UserIDOverride[] = [];
      for (let i = 0; i < count; i++) {
        const idOverride = apiToUserIDOverride(results[i].result);
        avalIdOverrides.push(idOverride);
        items.push({
          key: idOverride.uid,
          title: idOverride.uid,
        });
      }
      items = items.filter((item) => !member_idoverrideuser.includes(item.key));

      setAvailableIdOverrides(avalIdOverrides);
      setAvailableItems(items);
    }
  }, [idOverridesQuery.data, idOverridesQuery.isFetching]);

  // Add
  const onAddIdOverride = (items: AvailableItems[]) => {
    const newIdOverrideNames = items.map((item) => item.key);
    if (props.id === undefined || newIdOverrideNames.length == 0) {
      return;
    }

    const payload = {
      userGroup: props.id,
      entityType: "idoverrideuser",
      idsToAdd: newIdOverrideNames,
    } as MemberPayload;

    addMemberToIdOverride(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "add-member-success",
            "Assigned new User ID override to " + entityType + " " + props.id,
            "success"
          );
          // Update displayed User ID overrides before they are updated via refresh
          const newIdOverrides = idOverrides.concat(
            availableIdOverrides.filter((idOverride) =>
              newIdOverrideNames.includes(idOverride.uid)
            )
          );
          setIdOverrides(newIdOverrides);

          // Refresh data
          props.onRefreshData();
          // Close modal
          setShowAddModal(false);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert("add-member-error", errorMessage.message, "danger");
        }
      }
    });
  };

  // Delete
  const onDeleteIdOverride = () => {
    const payload = {
      userGroup: props.id,
      entityType: "idoverrideuser",
      idsToAdd: idOverridesSelected,
    } as MemberPayload;

    removeMembersFromIdOverrides(payload).then((response) => {
      if ("data" in response) {
        if (response.data.result) {
          // Set alert: success
          alerts.addAlert(
            "remove-idOverrides-success",
            "Removed idOverrides from " + entityType + " '" + props.id + "'",
            "success"
          );
          // Update displayed User ID overrides
          const newIdOverrides = idOverrides.filter(
            (idOverride) => !idOverridesSelected.includes(idOverride.uid)
          );
          setIdOverrides(newIdOverrides);
          // Update data
          setIdOverridesSelected([]);
          // Close modal
          setShowDeleteModal(false);
          // Refresh
          props.onRefreshData();
          // Back to page 1
          setPage(1);
        } else if (response.data.error) {
          // Set alert: error
          const errorMessage = response.data.error as unknown as ErrorResult;
          alerts.addAlert(
            "remove-idOverrides-error",
            errorMessage.message,
            "danger"
          );
        }
      }
    });
  };

  return (
    <>
      <alerts.ManagedAlerts />
      {membershipDisabled ? (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          helpIconEnabled={true}
          totalItems={idOverrideNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      ) : (
        <MemberOfToolbar
          searchText={searchValue}
          onSearchTextChange={setSearchValue}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onSearch={() => {}}
          refreshButtonEnabled={isRefreshButtonEnabled}
          onRefreshButtonClick={props.onRefreshData}
          deleteButtonEnabled={isDeleteEnabled}
          onDeleteButtonClick={() => setShowDeleteModal(true)}
          addButtonEnabled={isAddButtonEnabled}
          onAddButtonClick={() => setShowAddModal(true)}
          membershipDirectionEnabled={true}
          membershipDirection={membershipDirection}
          onMembershipDirectionChange={setMembershipDirection}
          helpIconEnabled={true}
          totalItems={idOverrideNames.length}
          perPage={perPage}
          page={page}
          onPerPageChange={setPerPage}
          onPageChange={setPage}
        />
      )}
      <MemberTable
        entityList={idOverrides}
        idKey="krbcanonicalname"
        columnNamesToShow={idOverrideColumnNames}
        propertiesToShow={idOverrideProperties}
        checkedItems={idOverridesSelected}
        onCheckItemsChange={setIdOverridesSelected}
        showTableRows={showTableRows}
      />
      <Pagination
        className="pf-v5-u-pb-0 pf-v5-u-pr-md"
        itemCount={idOverrideNames.length}
        widgetId="pagination-options-menu-bottom"
        perPage={perPage}
        page={page}
        variant={PaginationVariant.bottom}
        onSetPage={(_e, page) => setPage(page)}
        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
      />
      {showAddModal && (
        // TODO: Needs a custom add modal
        // <MemberOfAddModal
        //   showModal={showAddModal}
        //   onCloseModal={() => setShowAddModal(false)}
        //   availableItems={availableItems}
        //   onAdd={onAddIdOverride}
        //   onSearchTextChange={setAdderSearchValue}
        //   title={"Assign User Id Overrides to " + entityType + " " + props.id}
        //   ariaLabel={"Add " + entityType + " of User Id Override modal"}
        // />
      )}
      {showDeleteModal && someItemSelected && (
        <MemberOfDeleteModal
          showModal={showDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
          title={"Delete " + entityType + " from User Id Overrides"}
          onDelete={onDeleteIdOverride}
        >
          <MemberTable
            entityList={availableIdOverrides.filter((idOverride) =>
              idOverridesSelected.includes(idOverride.uid)
            )}
            idKey="uid"
            columnNamesToShow={idOverrideColumnNames}
            propertiesToShow={idOverrideProperties}
            showTableRows
          />
        </MemberOfDeleteModal>
      )}
    </>
  );
};

export default MembersUserIDOverrides;
