import React, { useMemo, useState } from "react";
import {
  Flex,
  FlexItem,
  PageSection,
  PaginationVariant,
  ToolbarItemVariant,
} from "@patternfly/react-core";
import {
  InnerScrollContainer,
  OuterScrollContainer,
} from "@patternfly/react-table";
import { Delegation } from "src/utils/datatypes/globalDataTypes";
import { ToolbarItem } from "src/components/layouts/ToolbarLayout";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import SearchInputLayout from "src/components/layouts/SearchInputLayout";
import MainTable from "src/components/tables/MainTable";
import PaginationLayout from "src/components/layouts/PaginationLayout";
import BulkSelectorPrep from "src/components/BulkSelectorPrep";
import AddDelegationModal from "src/components/modals/DelegationModals/AddDelegationModal";
import DeleteDelegationsModal from "src/components/modals/DelegationModals/DeleteDelegationsModal";
import useUpdateRoute from "src/hooks/useUpdateRoute";
import useListPageSearchParams from "src/hooks/useListPageSearchParams";
import useContextualHelpTopic from "src/hooks/useContextualHelpTopic";
import { toggleHelpPanel } from "src/store/Global/contextual-help-slice";
import { API_VERSION_BACKUP, isDelegationSelectable } from "src/utils/utils";
import {
  getSelectedPerPageData,
  ipaPrimaryKey,
} from "src/utils/selectedPerPage";
import { useGetDelegationsFullDataQuery } from "src/services/rpcDelegations";
import useApiError from "src/hooks/useApiError";
import GlobalErrors from "src/components/errors/GlobalErrors";
import ModalErrors from "src/components/errors/ModalErrors";

const Delegations = () => {
  const dispatch = useAppDispatch();

  useUpdateRoute({ pathname: "delegations" });
  useContextualHelpTopic("delegations");

  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  const { page, perPage, searchValue } = useListPageSearchParams();

  const globalErrors = useApiError([]);
  const modalErrors = useApiError([]);

  const firstIdx = (page - 1) * perPage;
  const lastIdx = page * perPage;

  const dataResponse = useGetDelegationsFullDataQuery({
    searchValue: searchValue,
    sizeLimit: 0,
    apiVersion: apiVersion || API_VERSION_BACKUP,
    startIdx: firstIdx,
    stopIdx: lastIdx,
  });

  const {
    data: batchResponse,
    isLoading: isBatchLoading,
    isFetching,
    error: batchError,
  } = dataResponse;

  const { elementsList, totalCount } = useMemo(() => {
    if (batchResponse?.result) {
      const results = batchResponse.result.results;
      const listSize = batchResponse.result.count;
      const items: Delegation[] = [];

      for (let i = 0; i < listSize; i++) {
        if (results[i]?.result) {
          items.push(results[i].result);
        }
      }

      return {
        elementsList: items,
        totalCount: batchResponse.result.totalCount,
      };
    }

    return { elementsList: [], totalCount: 0 };
  }, [batchResponse]);

  React.useEffect(() => {
    if (isFetching) {
      globalErrors.clear();
    }
  }, [isFetching]);

  React.useEffect(() => {
    if (
      !isBatchLoading &&
      !isFetching &&
      dataResponse.isError &&
      dataResponse.error !== undefined
    ) {
      const err = dataResponse.error;
      let contextMsg = "Error loading delegations";
      if ("error" in err && typeof err.error === "string" && err.error) {
        contextMsg += ": " + err.error;
      }
      globalErrors.addError(err, contextMsg, "delegations-fetch-error");
    }
  }, [
    dataResponse.isError,
    dataResponse.error,
    isBatchLoading,
    isFetching,
    globalErrors,
  ]);

  const refreshData = () => {
    clearSelectedDelegations();
    dataResponse.refetch();
  };

  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] =
    useState<boolean>(true);

  const [isDeletion, setIsDeletion] = useState(false);

  const [selectedDelegations, setSelectedDelegations] = useState<Delegation[]>(
    []
  );

  const clearSelectedDelegations = () => {
    setSelectedDelegations([]);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const selectableTable = elementsList.filter(isDelegationSelectable);

  const updateSelectedDelegations = (
    delegations: Delegation[],
    isSelected: boolean
  ) => {
    let newSelected: Delegation[] = [];
    if (isSelected) {
      newSelected = JSON.parse(JSON.stringify(selectedDelegations));
      for (let i = 0; i < delegations.length; i++) {
        const alreadySelected = selectedDelegations.find(
          (s) =>
            ipaPrimaryKey(s.aciname) === ipaPrimaryKey(delegations[i].aciname)
        );
        if (alreadySelected) {
          continue;
        }
        newSelected.push(delegations[i]);
      }
    } else {
      for (let i = 0; i < selectedDelegations.length; i++) {
        let found = false;
        for (let ii = 0; ii < delegations.length; ii++) {
          if (
            ipaPrimaryKey(selectedDelegations[i].aciname) ===
            ipaPrimaryKey(delegations[ii].aciname)
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          newSelected.push(selectedDelegations[i]);
        }
      }
    }
    setSelectedDelegations(newSelected);
    setIsDeleteButtonDisabled(newSelected.length === 0);
  };

  const setDelegationSelected = (
    delegation: Delegation,
    isSelecting = true
  ) => {
    if (isDelegationSelectable(delegation)) {
      updateSelectedDelegations([delegation], isSelecting);
    }
  };

  const selectedPerPageData = getSelectedPerPageData(
    elementsList,
    selectedDelegations.map((item) => ipaPrimaryKey(item.aciname)),
    (item) => ipaPrimaryKey(item.aciname)
  );

  const bulkSelectorData = {
    selected: selectedDelegations,
    updateSelected: updateSelectedDelegations,
    selectableTable: selectableTable,
    nameAttr: "aciname",
  };

  const buttonsData = {
    updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
  };

  const columnNames = ["Delegation name"];
  const keyNames = ["aciname"];

  const toolbarItems: ToolbarItem[] = [
    {
      key: 0,
      element: (
        <BulkSelectorPrep
          list={elementsList}
          shownElementsList={elementsList}
          elementData={bulkSelectorData}
          buttonsData={buttonsData}
          selectedPerPageData={selectedPerPageData}
        />
      ),
    },
    {
      key: 1,
      element: (
        <SearchInputLayout
          dataCy="search"
          name="search"
          ariaLabel="Search delegations"
          placeholder="Search"
        />
      ),
      toolbarItemVariant: ToolbarItemVariant.label,
      toolbarItemGap: { default: "gapMd" },
    },
    {
      key: 2,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 3,
      element: (
        <SecondaryButton
          onClickHandler={refreshData}
          isDisabled={isFetching}
          dataCy="delegations-button-refresh"
        >
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 4,
      element: (
        <SecondaryButton
          isDisabled={isDeleteButtonDisabled || isFetching}
          onClickHandler={() => setShowDeleteModal(true)}
          dataCy="delegations-button-delete"
        >
          Delete
        </SecondaryButton>
      ),
    },
    {
      key: 5,
      element: (
        <SecondaryButton
          onClickHandler={() => setShowAddModal(true)}
          isDisabled={isFetching}
          dataCy="delegations-button-add"
        >
          Add
        </SecondaryButton>
      ),
    },
    {
      key: 6,
      toolbarItemVariant: ToolbarItemVariant.separator,
    },
    {
      key: 7,
      element: (
        <HelpTextWithIconLayout
          textContent="Help"
          onClick={() => dispatch(toggleHelpPanel())}
        />
      ),
    },
    {
      key: 8,
      element: (
        <PaginationLayout
          list={elementsList}
          totalCount={totalCount}
          widgetId="pagination-options-menu-top"
          isCompact={true}
        />
      ),
      toolbarItemAlignment: { default: "alignEnd" },
    },
  ];

  return (
    <div>
      <PageSection hasBodyWrapper={false}>
        <TitleLayout
          id="delegations-title"
          headingLevel="h1"
          text="Delegations"
        />
      </PageSection>
      <PageSection hasBodyWrapper={false} isFilled={false}>
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <ToolbarLayout toolbarItems={toolbarItems} />
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto" }}>
            <OuterScrollContainer>
              <InnerScrollContainer
                style={{ height: "60vh", overflow: "auto" }}
              >
                {batchError !== undefined && batchError ? (
                  <GlobalErrors errors={globalErrors.getAll()} />
                ) : (
                  <MainTable
                    tableTitle="Delegations table"
                    shownElementsList={elementsList}
                    pk="aciname"
                    keyNames={keyNames}
                    columnNames={columnNames}
                    hasCheckboxes={true}
                    pathname="delegations"
                    showTableRows={!isFetching}
                    showLink={false}
                    elementsData={{
                      isElementSelectable: isDelegationSelectable,
                      selectedElements: selectedDelegations,
                      selectableElementsTable: selectableTable,
                      setElementsSelected: setDelegationSelected,
                      clearSelectedElements: clearSelectedDelegations,
                    }}
                    buttonsData={{
                      updateIsDeleteButtonDisabled: setIsDeleteButtonDisabled,
                      isDeletion,
                      updateIsDeletion: setIsDeletion,
                    }}
                    paginationData={selectedPerPageData}
                  />
                )}
              </InnerScrollContainer>
            </OuterScrollContainer>
          </FlexItem>
          <FlexItem style={{ flex: "0 0 auto", position: "sticky", bottom: 0 }}>
            <PaginationLayout
              list={elementsList}
              totalCount={totalCount}
              variant={PaginationVariant.bottom}
              widgetId="pagination-options-menu-bottom"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <AddDelegationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add delegation"
        onRefresh={refreshData}
      />
      <DeleteDelegationsModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        elementsToDelete={selectedDelegations}
        clearSelectedElements={clearSelectedDelegations}
        columnNames={columnNames}
        keyNames={keyNames}
        onRefresh={refreshData}
        updateIsDeleteButtonDisabled={setIsDeleteButtonDisabled}
        updateIsDeletion={setIsDeletion}
      />
      <ModalErrors
        errors={modalErrors.getAll()}
        dataCy="delegations-modal-error"
      />
    </div>
  );
};

export default Delegations;
