import React from "react";
// PatternFly
import {
  Button,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
// Layouts
import ModalWithFormLayout from "src/components/layouts/ModalWithFormLayout";
// Tables
import UsersDisplayTable from "src/components/tables/UsersDisplayTable";
// Redux
import { useAppDispatch } from "src/store/hooks";
import { removeUser as removePreservedUser } from "src/store/Identity/preservedUsers-slice";
// RPC
import { BatchRPCResponse, useRestoreUserMutation } from "src/services/rpc";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Navigation
import { NavigateFunction } from "react-router-dom";

interface SelectedUsersData {
  selectedUsers: string[];
  updateSelectedUsers: (newSelectedUsers: string[]) => void;
}

export interface PropsToPreservedUsers {
  show: boolean;
  handleModalToggle: () => void;
  selectedUsersData: SelectedUsersData;
  onRefresh?: () => void;
  navigateFunc?: NavigateFunction;
  navigateTo?: string;
}

const RestorePreservedUsers = (props: PropsToPreservedUsers) => {
  // Set dispatch (Redux)
  const dispatch = useAppDispatch();

  // Alerts
  const alerts = useAlerts();

  // Define 'executeUserRestoreCommand' to restore a preserved user
  const [executeUserRestoreCommand] = useRestoreUserMutation();

  // List of fields
  const fields = [
    {
      id: "question-text",
      pfComponent: (
        <TextContent>
          <Text component={TextVariants.p}>
            Are you sure you want to restore the preserved entries?
          </Text>
        </TextContent>
      ),
    },
    {
      id: "restore-users-table",
      pfComponent: (
        <UsersDisplayTable
          usersToDisplay={props.selectedUsersData.selectedUsers}
          from={"preserved-users"}
        />
      ),
    },
  ];

  // Close modal
  const closeModal = () => {
    props.handleModalToggle();
  };

  const [spinning, setBtnSpinning] = React.useState<boolean>(false);

  // Restore preserved user
  const restoreUsers = () => {
    setBtnSpinning(true);

    // Prepare users params
    const uidsToRestorePayload = props.selectedUsersData.selectedUsers;

    // [API call] Restore elements
    executeUserRestoreCommand(uidsToRestorePayload).then((response) => {
      if ("data" in response) {
        const data = response.data as BatchRPCResponse;
        const result = data.result;
        const error = data.error;

        if (result) {
          // Close modal
          closeModal();

          // Update data from Redux
          props.selectedUsersData.selectedUsers.map((user) => {
            dispatch(removePreservedUser(user[0]));
          });

          // Reset selected values
          props.selectedUsersData.updateSelectedUsers([]);

          // Show alert: success
          let successMessage = "";
          if (result.count > 1) {
            successMessage = result.count + " users restored";
          } else if (result.count === 1) {
            successMessage = result.results[0].summary;
          }
          alerts.addAlert("restore-users-success", successMessage, "success");

          // Refresh data
          if (props.onRefresh !== undefined) {
            props.onRefresh();
          }

          // Navigate to selected page
          if (
            props.navigateFunc !== undefined &&
            props.navigateTo !== undefined
          ) {
            props.navigateFunc(props.navigateTo);
          }
        } else if (error) {
          // Handle error
          alerts.addAlert("restore-users-error", error, "danger");
        }
      }
      setBtnSpinning(false);
    });
  };

  // Set the Modal and Action buttons for 'Restore' option
  const modalRestoreActions: JSX.Element[] = [
    <Button
      key="restore-users"
      variant="primary"
      onClick={restoreUsers}
      form="restore-users-modal"
      spinnerAriaValueText="Restoring"
      spinnerAriaLabel="Restoring"
      isLoading={spinning}
      isDisabled={spinning}
    >
      {spinning ? "Restoring" : "Restore"}
    </Button>,
    <Button key="cancel-restore-user" variant="link" onClick={closeModal}>
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType="medium"
        modalPosition="top"
        offPosition="76px"
        title="Restore preserved user"
        formId="restore-users-stage-modal"
        fields={fields}
        show={props.show}
        onClose={closeModal}
        actions={modalRestoreActions}
      />
    </>
  );
};

export default RestorePreservedUsers;
