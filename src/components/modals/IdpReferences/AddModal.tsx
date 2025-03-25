import React from "react";
// PatternFly
import {
  Button,
  HelperText,
  HelperTextItem,
  Radio,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { SelectOptionProps } from "@patternfly/react-core";
// Components
import ModalWithFormLayout, {
  Field,
} from "src/components/layouts/ModalWithFormLayout";
import SimpleSelector from "src/components/layouts/SimpleSelector";
// RPC
import {
  CustomIdpAddPayload,
  IdpAddPayload,
  KeycloakOrRedHatSSOAddPayload,
  MicrosoftOrAzureAddPayload,
  useIdpAddMutation,
} from "src/services/rpcIdp";
// Hooks
import useAlerts from "src/hooks/useAlerts";
// Errors
import { SerializedError } from "@reduxjs/toolkit";
// Components
import TitleLayout from "src/components/layouts/TitleLayout";

interface PropsToAddModal {
  isOpen: boolean;
  onCloseModal: () => void;
  title: string;
  onRefresh: () => void;
}

const AddModal = (props: PropsToAddModal) => {
  // Alerts to show in the UI
  const alerts = useAlerts();

  // API calls
  const [addIdp] = useIdpAddMutation();

  // States
  const [isAddButtonSpinning, setIsAddButtonSpinning] = React.useState(false);
  const [isAddAnotherButtonSpinning, setIsAddAnotherButtonSpinning] =
    React.useState(false);
  // - Fields
  const [idpRefName, setIdpRefName] = React.useState<string>("");
  const [clientId, setClientId] = React.useState<string>("");
  const [secret, setSecret] = React.useState<string>("");
  const [verifySecret, setVerifySecret] = React.useState<string>("");
  // -- Provider type radio
  const [isPreDefinedChecked, setIsPreDefinedChecked] =
    React.useState<boolean>(true);
  const [isCustomChecked, setIsCustomChecked] = React.useState<boolean>(false);
  // -- Provider type selector
  const [selectedProvider, setSelectedProvider] = React.useState<string>(
    "Keycloak or Red Hat SSO"
  );
  const providerOptions: SelectOptionProps[] = [
    {
      label: "keycloak",
      value: "Keycloak or Red Hat SSO",
    },
    {
      label: "google",
      value: "Google",
    },
    {
      label: "github",
      value: "Github",
    },
    {
      label: "microsoft",
      value: "Microsoft or Azure",
    },
    {
      label: "okta",
      value: "Okta",
    },
  ];
  // -- Pre-defined IdP template fields
  const [org, setOrg] = React.useState<string>("");
  const [baseUrl, setBaseUrl] = React.useState<string>("");
  // -- Custom IdP definition fields
  const [authUri, setAuthUri] = React.useState<string>("");
  const [devAuthUri, setDevAuthUri] = React.useState<string>("");
  const [tokenUri, setTokenUri] = React.useState<string>("");
  const [userInfoUri, setUserInfoUri] = React.useState<string>("");
  const [jwksUri, setJwksUri] = React.useState<string>("");
  // -- Common fields (Optional)
  const [scope, setScope] = React.useState<string>("");
  const [extIdpUidAttr, setExtIdpUidAttr] = React.useState<string>("");

  // Clear fields
  const clearAllFields = () => {
    setIdpRefName("");
    setClientId("");
    setSecret("");
    setVerifySecret("");
    setOrg("");
    setBaseUrl("");
    setAuthUri("");
    setDevAuthUri("");
    setTokenUri("");
    setUserInfoUri("");
    setJwksUri("");
    setScope("");
    setExtIdpUidAttr("");
    // Selector
    setSelectedProvider("Keycloak or Red Hat SSO");
    // Radio buttons
    setIsPreDefinedChecked(true);
    setIsCustomChecked(false);
  };

  const clearIdpDetailsFields = () => {
    setOrg("");
    setBaseUrl("");
    setAuthUri("");
    setDevAuthUri("");
    setTokenUri("");
    setUserInfoUri("");
    setJwksUri("");
    setScope("");
    setExtIdpUidAttr("");
    // Selector
    setSelectedProvider("Keycloak or Red Hat SSO");
    // Radio buttons
    setIsPreDefinedChecked(true);
    setIsCustomChecked(false);
  };

  // on change radio functions
  const onPreDefinedChange = (isChecked: boolean) => {
    setIsPreDefinedChecked(isChecked);
    setIsCustomChecked(!isChecked);
    clearIdpDetailsFields();
  };

  const onCustomChange = (isChecked: boolean) => {
    setIsPreDefinedChecked(!isChecked);
    setIsCustomChecked(isChecked);
    clearIdpDetailsFields();
  };

  // on Add IdP reference
  const onAdd = (keepModalOpen: boolean) => {
    setIsAddButtonSpinning(true);
    setIsAddAnotherButtonSpinning(true);

    const payload: IdpAddPayload = {
      cn: idpRefName,
      ipaidpclientid: clientId,
    };

    // Define payload based on the radio buttons and selected provider
    if (isPreDefinedChecked) {
      if (selectedProvider === "Keycloak or Red Hat SSO") {
        payload.ipaidpprovider = "keycloak";
        const keycloakData: KeycloakOrRedHatSSOAddPayload = {
          ipaidpclientid: clientId,
          ipaidporg: org,
          ipaidpbaseurl: baseUrl,
        };
        payload.keycloakRedHatData = keycloakData;
      } else if (selectedProvider === "Microsoft or Azure") {
        payload.ipaidpprovider = "microsoft";
        const microsoftData: MicrosoftOrAzureAddPayload = {
          ipaidpclientid: clientId,
          ipaidporg: org,
        };
        payload.microsoftAzureData = microsoftData;
      } else if (selectedProvider === "Okta") {
        payload.ipaidpprovider = "okta";
        const oktaData: KeycloakOrRedHatSSOAddPayload = {
          ipaidpclientid: clientId,
          ipaidporg: org,
          ipaidpbaseurl: baseUrl,
        };
        payload.keycloakRedHatData = oktaData;
      } else if (selectedProvider === "Google") {
        payload.ipaidpprovider = "google";
      } else if (selectedProvider === "Github") {
        payload.ipaidpprovider = "github";
      }
    } else if (isCustomChecked) {
      const customData: CustomIdpAddPayload = {
        // cn: idpRefName,
        ipaidpclientid: clientId,
        ipaidpauthendpoint: authUri,
        ipaidpdevauthendpoint: devAuthUri,
        ipaidptokenendpoint: tokenUri,
        ipaidpuserinfoendpoint: userInfoUri,
        ipaidpkeysendpoint: jwksUri,
      };
      payload.customFields = customData;
    }

    addIdp(payload).then((result) => {
      if ("data" in result) {
        const data = result.data.result;
        const error = result.data.error as SerializedError;

        if (error) {
          alerts.addAlert("add-idp-error", error.message, "danger");
        }

        if (data) {
          alerts.addAlert(
            "add-idp-success",
            "Identity provider successfully added",
            "success"
          );
          // Reset selected item
          clearAllFields();
          // Update data
          props.onRefresh();
          // 'Add and add another' will keep the modal open
          if (!keepModalOpen) {
            props.onCloseModal();
          }
          // Reset button spinners
          setIsAddButtonSpinning(false);
          setIsAddAnotherButtonSpinning(false);
        }
      }
    });
  };

  // Clean and close modal
  const cleanAndCloseModal = () => {
    clearAllFields();
    props.onCloseModal();
  };

  // Fields
  const clientDetailFields: Field[] = [
    {
      id: "title1",
      name: "",
      pfComponent: (
        <TitleLayout
          headingLevel="h3"
          id="oauth2-title"
          text="OAuth2 2.0 client details"
        />
      ),
    },
    {
      id: "identity-provider-reference-name",
      name: "Identity Provider reference name",
      pfComponent: (
        <TextInput
          type="text"
          id="identity-provider-reference-name"
          name="cn"
          value={idpRefName}
          aria-label="Identity Provider reference name"
          onChange={(_event, value: string) => setIdpRefName(value)}
          isRequired
        />
      ),
      fieldRequired: true,
    },
    {
      id: "client-id",
      name: "Client identifier",
      pfComponent: (
        <TextInput
          type="text"
          id="client-id"
          name="ipaidpclientid"
          value={clientId}
          aria-label="Client identifier"
          onChange={(_event, value) => setClientId(value)}
          isRequired
        />
      ),
      fieldRequired: true,
    },
    {
      id: "secret",
      name: "Secret",
      pfComponent: (
        <TextInput
          type="text"
          id="secret"
          name="ipaidpclientsecret"
          value={secret}
          aria-label="Secret"
          onChange={(_event, value) => setSecret(value)}
        />
      ),
    },
    {
      id: "verify-secret",
      name: "Verify secret",
      pfComponent: (
        <>
          <TextInput
            type="text"
            id="verify-secret"
            name="ipaidpclientsecret_verify"
            value={verifySecret}
            aria-label="Verify secret"
            onChange={(_event, value) => setVerifySecret(value)}
            validated={
              secret !== "" && verifySecret !== secret
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
          />
          <HelperText>
            {secret !== "" && verifySecret !== secret && (
              <HelperTextItem>Secret should match</HelperTextItem>
            )}
          </HelperText>
        </>
      ),
    },
  ];

  const providerTypeRadioFields: Field[] = [
    {
      id: "title2",
      name: "",
      pfComponent: (
        <TitleLayout
          headingLevel="h3"
          id="idp-title"
          text="Identity provider details"
          aria-label="Identity provider details"
        />
      ),
    },
    {
      id: "provider-type-radios",
      name: "Provider type",
      pfComponent: (
        <>
          <Radio
            isChecked={isPreDefinedChecked}
            name="predefined-idp"
            onChange={(_event, isChecked) => onPreDefinedChange(isChecked)}
            label="Pre-defined IdP template"
            id="predefined-provider"
            aria-label="Pre-defined IdP template"
          />
          <Radio
            isChecked={isCustomChecked}
            name="custom-idp"
            onChange={(_event, isChecked) => onCustomChange(isChecked)}
            label="Custom IdP definition"
            id="custom-provider"
            aria-label="Custom IdP definition"
          />
        </>
      ),
    },
  ];

  const providerTypeSelector: Field[] = [
    {
      id: "provider-type-selector",
      name: "Provider type",
      pfComponent: (
        <SimpleSelector
          id="provider-type-selector"
          options={providerOptions}
          selected={selectedProvider}
          onSelectedChange={(selected: string) => {
            setSelectedProvider(selected);
            clearIdpDetailsFields();
          }}
          ariaLabel="Provider type selector"
        />
      ),
    },
  ];

  // 'Keycloak or Red Hat SSO' option fields
  const keycloakOptionFields: Field[] = [
    {
      id: "org",
      name: "Organization",
      pfComponent: (
        <TextInput
          type="text"
          id="org"
          name="ipaidporg"
          value={org}
          aria-label="Organization"
          onChange={(_event, value) => setOrg(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "base-url",
      name: "Base URL",
      pfComponent: (
        <TextInput
          type="text"
          id="base-url"
          name="ipaidpbaseurl"
          value={baseUrl}
          aria-label="Base URL"
          onChange={(_event, value) => setBaseUrl(value)}
        />
      ),
      fieldRequired: true,
    },
  ];

  // 'Microsoft or Azure' option fields
  const microsoftOptionFields: Field[] = [
    {
      id: "org",
      name: "Organization",
      pfComponent: (
        <TextInput
          type="text"
          id="org"
          name="ipaidporg"
          value={org}
          aria-label="Organization"
          onChange={(_event, value) => setOrg(value)}
        />
      ),
      fieldRequired: true,
    },
  ];

  const customIdpFields: Field[] = [
    {
      id: "auth-uri",
      name: "Authorization URI",
      pfComponent: (
        <TextInput
          type="text"
          id="auth-uri"
          name="ipaidpauthendpoint"
          value={authUri}
          aria-label="Authorization URI"
          onChange={(_event, value) => setAuthUri(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "dev-auth-uri",
      name: "Device authorization URI",
      pfComponent: (
        <TextInput
          type="text"
          id="dev-auth-uri"
          name="ipaidpdevauthendpoint"
          value={devAuthUri}
          aria-label="Device authorization URI"
          onChange={(_event, value) => setDevAuthUri(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "token-uri",
      name: "Token URI",
      pfComponent: (
        <TextInput
          type="text"
          id="token-uri"
          name="ipaidptokenendpoint"
          value={tokenUri}
          aria-label="Token URI"
          onChange={(_event, value) => setTokenUri(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "user-info-uri",
      name: "User info URI",
      pfComponent: (
        <TextInput
          type="text"
          id="user-info-uri"
          name="ipaidpuserinfoendpoint"
          value={userInfoUri}
          aria-label="User info URI"
          onChange={(_event, value) => setUserInfoUri(value)}
        />
      ),
      fieldRequired: true,
    },
    {
      id: "jwks-uri",
      name: "JWKS URI",
      pfComponent: (
        <TextInput
          type="text"
          id="jwks-uri"
          name="ipaidpkeysendpoint"
          value={jwksUri}
          aria-label="JWKS URI"
          onChange={(_event, value) => setJwksUri(value)}
        />
      ),
      fieldRequired: true,
    },
  ];

  const commonOptionalFields: Field[] = [
    {
      id: "scope",
      name: "Scope",
      pfComponent: (
        <TextInput
          type="text"
          id="scope"
          name="ipaidpscope"
          value={scope}
          aria-label="Scope"
          onChange={(_event, value) => setScope(value)}
        />
      ),
    },
    {
      id: "ext-idp-uid-attr",
      name: "External IdP UID attribute",
      pfComponent: (
        <TextInput
          type="text"
          id="ext-idp-uid-attr"
          name="ipaidpsub"
          value={extIdpUidAttr}
          aria-label="External IdP UID attribute"
          onChange={(_event, value) => setExtIdpUidAttr(value)}
        />
      ),
    },
  ];

  // Generate fields based on the selected provider
  const generateFields = () => {
    const fields: Field[] = [...clientDetailFields, ...providerTypeRadioFields];

    if (isPreDefinedChecked) {
      fields.push(...providerTypeSelector);
      switch (selectedProvider) {
        case "Keycloak or Red Hat SSO":
          fields.push(...keycloakOptionFields);
          break;
        case "Microsoft or Azure":
          fields.push(...microsoftOptionFields);
          break;
        case "Okta":
          fields.push(...keycloakOptionFields);
          break;
        default:
          break;
      }
    }

    if (isCustomChecked) {
      fields.push(...customIdpFields);
    }

    fields.push(...commonOptionalFields);

    return fields;
  };

  // Helper function: check if the 'Add' button should be disabled
  const checkFieldsAreEmpty = () => {
    return (
      idpRefName === "" ||
      clientId === "" ||
      (secret !== "" && verifySecret === "") ||
      (isPreDefinedChecked && selectedProvider === "") ||
      (isPreDefinedChecked &&
        selectedProvider === "Keycloak or Red Hat SSO" &&
        (org === "" || baseUrl === "")) ||
      (isPreDefinedChecked &&
        selectedProvider === "Microsoft or Azure" &&
        org === "") ||
      (isCustomChecked &&
        (authUri === "" ||
          devAuthUri === "" ||
          tokenUri === "" ||
          userInfoUri === "" ||
          jwksUri === ""))
    );
  };

  // Track if mandatory fields are empty
  React.useEffect(() => {
    if (areMandatoryFieldsEmpty !== checkFieldsAreEmpty()) {
      setAreMandatoryFieldsEmpty(checkFieldsAreEmpty());
    }
  }, [
    idpRefName,
    clientId,
    secret,
    verifySecret,
    isPreDefinedChecked,
    isCustomChecked,
    selectedProvider,
    org,
    baseUrl,
    authUri,
    devAuthUri,
    tokenUri,
    userInfoUri,
    jwksUri,
  ]);

  const [areMandatoryFieldsEmpty, setAreMandatoryFieldsEmpty] = React.useState(
    checkFieldsAreEmpty()
  );

  // Actions
  const modalActions: JSX.Element[] = [
    <Button
      key="add-new"
      variant="secondary"
      isDisabled={isAddButtonSpinning || areMandatoryFieldsEmpty}
      form="add-modal-form"
      onClick={() => {
        onAdd(false);
      }}
    >
      Add
    </Button>,
    <Button
      key="add-new-again"
      variant="secondary"
      isDisabled={isAddAnotherButtonSpinning || areMandatoryFieldsEmpty}
      form="add-again-modal-form"
      onClick={() => {
        onAdd(true);
      }}
    >
      Add and add again
    </Button>,
    <Button key="cancel-new" variant="link" onClick={cleanAndCloseModal}>
      Cancel
    </Button>,
  ];

  return (
    <>
      <alerts.ManagedAlerts />
      <ModalWithFormLayout
        variantType={"small"}
        modalPosition={"top"}
        offPosition={"76px"}
        title={props.title}
        formId="add-modal-form"
        fields={generateFields()}
        show={props.isOpen}
        onClose={cleanAndCloseModal}
        actions={modalActions}
      />
    </>
  );
};

export default AddModal;
