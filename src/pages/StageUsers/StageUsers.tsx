import React, { useEffect, useState } from "react";
// PatternFly
import {
  Page,
  PageSection,
  PageSectionVariants,
  TextVariants,
  PaginationVariant,
  TextContent,
  Title,
} from "@patternfly/react-core";
// PatternFly table
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
// Redux
import { useAppDispatch, useAppSelector } from "src/store/hooks";
// Hooks
import { updateUsersList } from "src/store/Identity/stageUsers-slice";
import { useAlerts } from "src/hooks/useAlerts";
// Layouts
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
// Tables
import UsersTable from "../../components/tables/UsersTable";
// Components
import PaginationPrep from "src/components/PaginationPrep";
import BulkSelectorUsersPrep from "src/components/BulkSelectorUsersPrep";
// Modals
import DeleteUsers from "src/components/modals/DeleteUsers";
import AddUser from "src/components/modals/AddUser";
import ActivateStageUsers from "src/components/modals/ActivateStageUsers";
// Utils
import { API_VERSION_BACKUP, isUserSelectable } from "src/utils/utils";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
// RPC client
import {
  useGettingStageUserQuery,
  GenericPayload,
  useSearchEntriesMutation,
} from "../../services/rpc";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";
// i18n
import { FormattedMessage } from "react-intl";

const StageUsers = () => {
  // Initialize stage users list (Redux)
  const dispatch = useAppDispatch();

  // Alerts to show in the UI
  const alerts = useAlerts();

  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Active users list
  const [stageUsersList, setStageUsersList] = useState<User[]>([]);

  // Handle API calls errors
  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  // Main states - what user can define / what we could use in page URL
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [totalCount, setUsersTotalCount] = useState<number>(0);
  const [searchDisabled, setSearchIsDisabled] = useState<boolean>(false);

  // Page indexes
  const firstUserIdx = (page - 1) * perPage;
  const lastUserIdx = page * perPage;

  // Derived states - what we get from API
  const userDataResponse = useGettingStageUserQuery({
    searchValue: "",
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstUserIdx,
    stopIdx: lastUserIdx,
  } as GenericPayload);

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    error: batchError,
  } = userDataResponse;

  // Handle data when the API call is finished
  useEffect(() => {
    if (userDataResponse.isFetching) {
      setShowTableRows(false);
      // Reset selected users on refresh
      setSelectedUserNames([]);
      setSelectedUserIds([]);
      setSelectedUsers([]);
      globalErrors.clear();
      return;
    }

    // API response: Success
    if (
      userDataResponse.isSuccess &&
      userDataResponse.data &&
      batchResponse !== undefined
    ) {
      const usersListResult = batchResponse.result.results;
      const usersListSize = batchResponse.result.count;
      const totalCount = batchResponse.result.totalCount;
      const usersList: User[] = [];

      for (let i = 0; i < usersListSize; i++) {
        usersList.push(usersListResult[i].result);
      }

      setUsersTotalCount(totalCount);
      // Update 'Stage users' slice data
      dispatch(updateUsersList(usersList));
      // Update the list of users
      setStageUsersList(usersList);
      // Show table elements
      setShowTableRows(true);
    }

    // API response: Error
    if (
      !userDataResponse.isLoading &&
      userDataResponse.isError &&
      userDataResponse.error !== undefined
    ) {
      globalErrors.addError(
        batchError,
        "Error when loading data",
        "error-batch-users"
      );
    }
  }, [userDataResponse]);

  // Refresh button handling
  const refreshUsersData = () => {
    // Hide table
    setShowTableRows(false);

    // Reset selected users on refresh
    setSelectedUserNames([]);
    setSelectedUserIds([]);
    setSelectedUsers([]);

    userDataResponse.refetch();
  };

  // Always refetch data when the component is loaded.
  // This ensures the data is always up-to-date.
  React.useEffect(() => {
    userDataResponse.refetch();
  }, []);

  // Selected users state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const updateSelectedUsers = (newSelectedUsers: string[]) => {
    setSelectedUsers(newSelectedUsers);
  };

  // 'Delete' button state
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const updateIsDeleteButtonDisabled = (value: boolean) => {
    setIsDeleteButtonDisabled(value);
  };

  // If some entries have been deleted, restore the selectedUsers list
  const [isDeletion, setIsDeletion] = useState(false);

  const updateIsDeletion = (value: boolean) => {
    setIsDeletion(value);
  };

  const updateSelectedUserIds = (newSelectedUserIds: string[]) => {
    setSelectedUserIds(newSelectedUserIds);
  };

  // Elements selected (per page)
  //  - This will help to calculate the remaining elements on a specific page (bulk selector)
  const [selectedPerPage, setSelectedPerPage] = useState<number>(0);

  const updateSelectedPerPage = (selected: number) => {
    setSelectedPerPage(selected);
  };

  // Pagination
  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const updatePerPage = (newSetPerPage: number) => {
    setPerPage(newSetPerPage);
  };

  // Users displayed on the first page
  const updateShownUsersList = (newShownUsersList: User[]) => {
    setStageUsersList(newShownUsersList);
  };

  // Filter (Input search)
  const updateSearchValue = (value: string) => {
    setSearchValue(value);
  };

  // Issue search with filter
  const [retrieveUser] = useSearchEntriesMutation({});

  // Issue a search using a specific search value
  const submitSearchValue = () => {
    setShowTableRows(false);
    setSearchIsDisabled(true);
    retrieveUser({
      searchValue: searchValue,
      sizeLimit: 0,
      apiVersion: apiVersion || API_VERSION_BACKUP,
      startIdx: firstUserIdx,
      stopIdx: lastUserIdx,
      entryType: "stage",
    } as GenericPayload).then((result) => {
      // Manage new response here
      if ("data" in result) {
        const searchError = result.data.error as
          | FetchBaseQueryError
          | SerializedError;

        if (searchError) {
          // Error
          let error: string | undefined = "";
          if ("error" in searchError) {
            error = searchError.error;
          } else if ("message" in searchError) {
            error = searchError.message;
          }
          alerts.addAlert(
            "submit-search-value-error",
            error || "Error when searching for stage users",
            "danger"
          );
        } else {
          // Success
          const usersListResult = result.data.result.results;
          const usersListSize = result.data.result.count;
          const totalCount = result.data.result.totalCount;
          const usersList: User[] = [];

          for (let i = 0; i < usersListSize; i++) {
            usersList.push(usersListResult[i].result);
          }

          // Update slice data
          dispatch(updateUsersList(usersList));
          setStageUsersList(usersList);
          setUsersTotalCount(totalCount);
          // Show table elements
          setShowTableRows(true);
        }
        setSearchIsDisabled(false);
      }
    });
  };

  // Show table rows
  const [showTableRows, setShowTableRows] = useState(!isBatchLoading);

  // Show table rows only when data is fully retrieved
  useEffect(() => {
    if (showTableRows !== !isBatchLoading) {
      setShowTableRows(!isBatchLoading);
    }
  }, [isBatchLoading]);

  // Modals functionality
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const onAddClickHandler = () => {
    setShowAddModal(true);
  };
  const onCloseAddModal = () => {
    setShowAddModal(false);
  };
  const onAddModalToggle = () => {
    setShowAddModal(!showAddModal);
  };
  const onDeleteHandler = () => {
    setShowDeleteModal(true);
  };
  const onDeleteModalToggle = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const onActivateHandler = () => {
    setShowActivateModal(true);
  };
  const onActivateModalToggle = () => {
    setShowActivateModal(!showActivateModal);
  };

  // Table-related shared functionality
  // - Selectable checkboxes on table
  const selectableUsersTable = stageUsersList.filter(isUserSelectable); // elements per Table

  // - Selected rows are tracked. Primary key: userLogin
  const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);

  const changeSelectedUserNames = (selectedUsernames: string[]) => {
    setSelectedUserNames(selectedUsernames);
  };

  // - Helper method to set the selected users from the table
  const setUserSelected = (user: User, isSelecting = true) =>
    setSelectedUserNames((prevSelected) => {
      const otherSelectedUserNames = prevSelected.filter((r) => r !== user.uid);
      return isSelecting && isUserSelectable(user)
        ? [...otherSelectedUserNames, user.uid]
        : otherSelectedUserNames;
    });

  // Data wrappers
  // - 'PaginationPrep'
  const paginationData = {
    page,
    perPage,
    updatePage,
    updatePerPage,
    showTableRows,
    updateSelectedPerPage,
    updateShownElementsList: updateShownUsersList,
  };

  // - 'BulkSelectorPrep'
  const usersData = {
    selectedUsers,
    updateSelectedUsers,
    updateSelectedUserIds,
    selectedUserNames,
    changeSelectedUserNames,
    selectableUsersTable,
    isUserSelectable,
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled,
  };

  const selectedPerPageData = {
    selectedPerPage,
    updateSelectedPerPage,
  };

  // 'DeleteUsers'
  const deleteUsersButtonsData = {
    updateIsDeleteButtonDisabled,
    updateIsDeletion,
  };

  const selectedUsersData = {
    selectedUsers,
    updateSelectedUsers,
  };

  // 'UsersTable'
  const usersTableData = {
    isUserSelectable,
    selectedUserNames,
    changeSelectedUserNames,
    selectedUserIds,
    updateSelectedUserIds,
    selectableUsersTable,
    setUserSelected,
    updateSelectedUsers,
  };

  const usersTableButtonsData = {
    updateIsDeleteButtonDisabled,
    isDeletion,
    updateIsDeletion,
  };

  // 'SearchInputLayout'
  const searchValueData = {
    searchValue,
    updateSearchValue,
    submitSearchValue,
  };

  // List of Toolbar items
  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorUsersPrep
          list={stageUsersList}
          shownElementsList={stageUsersList}
          usersData={usersData}
          buttonsData={buttonsData}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          name="search"
          ariaLabel="Search user"
          placeholder="Search"
          searchValueData={searchValueData}
          isDisabled={searchDisabled}
        />
      ),
      toolbarItemVariant: "search-filter",
      toolbarItemSpacer: { default: "spacerMd" },
    },
    {
      key: 2,
      toolbarItemVariant: "separator",
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          onClickHandler={refreshUsersData}
          isDisabled={!showTableRows}
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || !showTableRows}
          onClickHandler={onDeleteHandler}
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          onClickHandler={onAddClickHandler}
          isDisabled={!showTableRows}
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      element: (
        <SecondaryButton
          isDisabled={!showTableRows || selectedUsers.length === 0}
          onClickHandler={onActivateHandler}
        >
          Activate
        </SecondaryButton>
      ),
    },
    {
      key: 7,
      toolbarItemVariant: "separator",
    },
    {
      key: 8,
      element: (
        <HelpTextWithIconLayout
          textComponent={TextVariants.p}
          subTextComponent={TextVariants.a}
          subTextIsVisitedLink={true}
          textContent="Help"
          icon={
            <OutlinedQuestionCircleIcon className="pf-v5-u-primary-color-100 pf-v5-u-mr-sm" />
          }
        />
      ),
    },
    {
      key: 9,
      element: (
        <PaginationPrep
          list={stageUsersList}
          paginationData={paginationData}
          widgetId="pagination-options-menu-top"
          isCompact={true}
          totalCount={totalCount}
        />
      ),
      toolbarItemAlignment: { default: "alignRight" },
    },
  ];

  // Render 'Stage users'
  return (
    <Page>
      <alerts.ManagedAlerts />
      <PageSection variant={PageSectionVariants.light}>
        {/* Before, by using the 'TitleLayout' component:
          <TitleLayout
            id="stage users title"
            headingLevel="h1"
            text="Stage users"
          /> */}
        <TextContent key={"stage users title"}>
          <Title headingLevel={"h1"} id={"stage users title"}>
            <FormattedMessage id="stageUsers" />
          </Title>
        </TextContent>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        isFilled={false}
        className="pf-v5-u-m-lg pf-v5-u-pb-md pf-v5-u-pl-0 pf-v5-u-pr-0"
      >
        <ToolbarLayout
          className="pf-v5-u-pt-0 pf-v5-u-pl-lg pf-v5-u-pr-md"
          contentClassName="pf-v5-u-p-0"
          toolbarItems={toolbarItems}
        />
        <div style={{ height: `calc(100vh - 352.2px)` }}>
          <OuterScrollContainer>
            <InnerScrollContainer>
              {batchError !== undefined && batchError ? (
                <GlobalErrors errors={globalErrors.getAll()} />
              ) : (
                <UsersTable
                  elementsList={stageUsersList}
                  shownElementsList={stageUsersList}
                  from="stage-users"
                  showTableRows={showTableRows}
                  usersData={usersTableData}
                  buttonsData={usersTableButtonsData}
                  paginationData={selectedPerPageData}
                  searchValue={searchValue}
                />
              )}
            </InnerScrollContainer>
          </OuterScrollContainer>
        </div>
        <PaginationPrep
          list={stageUsersList}
          paginationData={paginationData}
          variant={PaginationVariant.bottom}
          widgetId="pagination-options-menu-bottom"
          perPageComponent="button"
          className="pf-v5-u-pb-0 pf-v5-u-pr-md"
          totalCount={totalCount}
        />
      </PageSection>
      <ModalErrors errors={modalErrors.getAll()} />
      <AddUser
        show={showAddModal}
        from="stage-users"
        setShowTableRows={setShowTableRows}
        handleModalToggle={onAddModalToggle}
        onOpenAddModal={onAddClickHandler}
        onCloseAddModal={onCloseAddModal}
        onRefresh={refreshUsersData}
      />
      <DeleteUsers
        show={showDeleteModal}
        from="stage-users"
        handleModalToggle={onDeleteModalToggle}
        selectedUsersData={selectedUsersData}
        buttonsData={deleteUsersButtonsData}
        onRefresh={refreshUsersData}
      />
      <ActivateStageUsers
        show={showActivateModal}
        handleModalToggle={onActivateModalToggle}
        selectedUids={selectedUsers.map((uid) => uid[0])}
        onSuccess={refreshUsersData}
      />
    </Page>
  );
};

export default StageUsers;
