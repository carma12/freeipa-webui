/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SyntheticEvent, useEffect, useState } from "react";
// PatternFly
import {
  PageSection,
  PageSectionVariants,
  JumpLinks,
  JumpLinksItem,
  TextVariants,
  Flex,
  DropdownItem,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  DropdownDirection,
  Spinner,
  Button,
} from "@patternfly/react-core";
// Icons
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/esm/icons/outlined-question-circle-icon";
// Data types
import { User } from "src/utils/datatypes/globalDataTypes";
// Layouts
import ToolbarLayout from "src/components/layouts/ToolbarLayout";
import TitleLayout from "src/components/layouts/TitleLayout";
import HelpTextWithIconLayout from "src/components/layouts/HelpTextWithIconLayout";
import SecondaryButton from "src/components/layouts/SecondaryButton";
import KebabLayout from "src/components/layouts/KebabLayout";
// Field sections
import UsersIdentity from "src/components/UsersSections/UsersIdentity";
import UsersAccountSettings from "src/components/UsersSections/UsersAccountSettings";
import UsersPasswordPolicy from "src/components/UsersSections/UsersPasswordPolicy";
import UsersKerberosTicket from "src/components/UsersSections/UsersKerberosTicket";
import UsersContactSettings from "src/components/UsersSections/UsersContactSettings";
import UsersMailingAddress from "src/components/UsersSections/UsersMailingAddress";
import UsersEmployeeInfo from "src/components/UsersSections/UsersEmployeeInfo";
import UsersAttributesSMB from "src/components/UsersSections/UsersAttributesSMB";
// Redux
import { useAppSelector } from "src/store/hooks";
// RPC
import {
  BatchRPCResponse,
  Command,
  FindRPCResponse,
  useBatchCommandQuery,
  useBatchMutCommandMutation,
  useSimpleCommandQuery,
  useSimpleMutCommandMutation,
} from "src/services/rpc";
// Errors
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import ErrorModal from "./modals/ErrorModal";

export interface PropsToUserSettings {
  user: User;
  from: "active-users" | "stage-users" | "preserved-users";
}

const UserSettings = (props: PropsToUserSettings) => {
  // Retrieve API version from environment data
  const apiVersion = useAppSelector(
    (state) => state.global.environment.api_version
  ) as string;

  // Define functions to execute commands (via Mutation)
  const [retrieveUserData] = useBatchMutCommandMutation();
  const [retrieveRadiusProxy] = useSimpleMutCommandMutation();
  const [retrieveIdp] = useSimpleMutCommandMutation();
  const [retrieveUids] = useSimpleMutCommandMutation();

  // Loading data
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Initialize data
  const [userShowData, setUserShowData] = useState<Record<string, unknown>>();
  const [pwpolicyShowData, setPwpolicyShowData] =
    useState<Record<string, unknown>>();
  const [krbtpolicyShowData, setKrbtpolicyShowData] =
    useState<Record<string, unknown>>();
  const [certFindData, setCertFindData] = useState<Record<string, unknown>>();
  const [radiusProxyData, setRadiusProxyData] =
    useState<Record<string, unknown>>();
  const [idpData, setIdpData] = useState<Record<string, unknown>>();
  const [uidsData, setUidsData] = useState<Record<string, unknown>>();
  // Attribute level rights
  // - Some fields are hidden for some users and can have different
  //   read/write permissions.
  const [attrLevelRights, setAttrLevelRights] = useState<any>("");

  // [API call] Get full user information
  const userShowCommand: Command = {
    method: "user_show",
    params: [props.user.uid, { all: true, rights: true }],
  };

  const pwpolicyShowCommand: Command = {
    method: "pwpolicy_show",
    params: [[], { user: props.user.uid[0], all: true, rights: true }],
  };

  const krbtpolicyShowCommand: Command = {
    method: "krbtpolicy_show",
    params: [props.user.uid, { all: true, rights: true }],
  };

  const certFindCommand: Command = {
    method: "cert_find",
    params: [[], { user: props.user.uid[0], sizelimit: 0, all: true }],
  };

  const batchPayload: Command[] = [
    userShowCommand,
    pwpolicyShowCommand,
    krbtpolicyShowCommand,
    certFindCommand,
  ];

  const { data: batchResponse, isLoading: isBatchLoading } =
    useBatchCommandQuery(batchPayload);

  // [API calls] Get context information
  // - RADIUS Proxy
  const radiusproxyPayload: Command = {
    method: "radiusproxy_find",
    params: [[], { version: apiVersion }],
  };

  const { data: radiusProxyResponse, isLoading: isRadiusProxyLoading } =
    useSimpleCommandQuery(radiusproxyPayload);

  // - External IPD
  const idpPayload: Command = {
    method: "idp_find",
    params: [[], { version: apiVersion }],
  };

  const { data: idpResponse, isLoading: isIdpLoading } =
    useSimpleCommandQuery(idpPayload);

  // - User IDs
  const userIdsPayload: Command = {
    method: "user_find",
    params: [[], { no_members: true, version: apiVersion }],
  };

  const { data: uidsResponse, isLoading: isUidsLoading } =
    useSimpleCommandQuery(userIdsPayload);

  // Update batch data when available
  useEffect(() => {
    // Batch
    if (batchResponse !== undefined) {
      setUserShowData(batchResponse.result.results[0].result);
      setPwpolicyShowData(batchResponse.result.results[1].result);
      setKrbtpolicyShowData(batchResponse.result.results[2].result);
      setCertFindData(batchResponse.result.results[3].result);
      setAttrLevelRights(
        batchResponse.result.results[0].result.attributelevelrights
      );
    }
  }, [isBatchLoading]);

  // Update RADIUS proxy data when available
  useEffect(() => {
    if (radiusProxyResponse !== undefined) {
      setRadiusProxyData(radiusProxyResponse.result.result);
    }
  }, [isRadiusProxyLoading]);

  // Update External IdP data when available
  useEffect(() => {
    if (idpResponse !== undefined) {
      setIdpData(idpResponse.result.result);
    }
  }, [isIdpLoading]);

  // Update User IDs data when available
  useEffect(() => {
    if (uidsResponse !== undefined) {
      setUidsData(uidsResponse.result.result);
    }
  }, [isUidsLoading]);

  // Update the data loading flag
  useEffect(() => {
    if (
      !isBatchLoading &&
      !isRadiusProxyLoading &&
      !isIdpLoading &&
      !isUidsLoading
    ) {
      setIsDataLoading(false);
    }
  }, [isBatchLoading, isRadiusProxyLoading, isIdpLoading, isUidsLoading]);

  // Kebab
  const [isKebabOpen, setIsKebabOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem key="reset password">Reset password</DropdownItem>,
    <DropdownItem key="enable" isDisabled>
      Enable
    </DropdownItem>,
    <DropdownItem key="disable">Disable</DropdownItem>,
    <DropdownItem key="delete">Delete</DropdownItem>,
    <DropdownItem key="unlock" isDisabled>
      Unlock
    </DropdownItem>,
    <DropdownItem key="add otp token">Add OTP token</DropdownItem>,
    <DropdownItem key="rebuild auto membership">
      Rebuild auto membership
    </DropdownItem>,
    <DropdownItem key="new certificate">New certificate</DropdownItem>,
  ];

  const onKebabToggle = (isOpen: boolean) => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: SyntheticEvent<HTMLDivElement, Event> | undefined
  ) => {
    setIsKebabOpen(!isKebabOpen);
  };

  // Spinner UI
  const spinner = (
    <Spinner
      isSVG
      style={{ alignSelf: "center", marginLeft: "45%", marginTop: "5%" }}
      aria-label="Loading contents of user settings"
    />
  );

  // Handle API error data
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const closeAndCleanErrorParameters = () => {
    setIsModalErrorOpen(false);
    setErrorTitle("");
    setErrorMessage("");
  };

  const onCloseErrorModal = () => {
    closeAndCleanErrorParameters();
  };

  const errorModalActions = [
    <Button key="cancel" variant="link" onClick={onCloseErrorModal}>
      Cancel
    </Button>,
  ];

  const handleAPIError = (error: FetchBaseQueryError | SerializedError) => {
    if ("error" in error) {
      setErrorTitle("IPA error");
      if (error.data !== undefined) {
        setErrorMessage(error.error);
      }
    }
    setIsModalErrorOpen(true);
  };

  // Refresh data
  const refreshUserData = () => {
    // Set data loading flag
    setIsDataLoading(true);

    // Make API calls
    // - User data & others (batch)
    retrieveUserData(batchPayload).then((batchResponse) => {
      if ("data" in batchResponse) {
        const responseData = batchResponse.data as BatchRPCResponse;
        const usersList = responseData.result.results;
        const usersError = responseData.error as
          | FetchBaseQueryError
          | SerializedError;
        if (usersList !== undefined) {
          setUserShowData(usersList[0].result);
          setPwpolicyShowData(usersList[1].result);
          setKrbtpolicyShowData(usersList[2].result);
          setCertFindData(usersList[3].result);
          setAttrLevelRights(usersList[0].result.attributelevelrights);
        } else if (usersError) {
          handleAPIError(usersError);
        }
      }
      // This batch will finish later than the other calls.
      //   So remove spinner and show data when finished.
      setIsDataLoading(false);
    });

    // - Radius proxy data
    retrieveRadiusProxy(radiusproxyPayload).then((radiusProxyResponse) => {
      if ("data" in radiusProxyResponse) {
        const responseData = radiusProxyResponse.data as FindRPCResponse;
        const radiusProxyList = responseData.result.result;
        const radiusProxyError = responseData.error as
          | FetchBaseQueryError
          | SerializedError;
        if (radiusProxyList !== undefined) {
          setRadiusProxyData(radiusProxyList);
        } else if (radiusProxyError) {
          handleAPIError(radiusProxyError);
        }
      }
    });

    // - IDP data
    retrieveIdp(idpPayload).then((idpResponse) => {
      if ("data" in idpResponse) {
        const responseData = idpResponse.data as FindRPCResponse;
        const idpList = responseData.result.result;
        const idpError = responseData.error as
          | FetchBaseQueryError
          | SerializedError;
        if (idpList !== undefined) {
          setIdpData(idpList);
        } else if (idpError) {
          handleAPIError(idpError);
        }
      }
    });

    // - UIDs data
    retrieveUids(userIdsPayload).then((uidsResponse) => {
      if ("data" in uidsResponse) {
        const responseData = uidsResponse.data as FindRPCResponse;
        const uidsList = responseData.result.result;
        const uidsError = responseData.error as
          | FetchBaseQueryError
          | SerializedError;
        if (uidsList !== undefined) {
          setUidsData(uidsList);
        } else if (uidsError) {
          handleAPIError(uidsError);
        }
      }
    });
  };

  // Toolbar
  const toolbarFields = [
    {
      key: 0,
      element: (
        <SecondaryButton onClickHandler={refreshUserData}>
          Refresh
        </SecondaryButton>
      ),
    },
    {
      key: 1,
      element: <SecondaryButton isDisabled={true}>Revert</SecondaryButton>,
    },
    {
      key: 2,
      element: <SecondaryButton isDisabled={true}>Save</SecondaryButton>,
    },
    {
      key: 3,
      element: (
        <KebabLayout
          direction={DropdownDirection.up}
          onDropdownSelect={onKebabSelect}
          onKebabToggle={onKebabToggle}
          idKebab="toggle-action-buttons"
          isKebabOpen={isKebabOpen}
          isPlain={true}
          dropdownItems={dropdownItems}
        />
      ),
    },
  ];

  // 'UserSettings' render
  return (
    <>
      <PageSection
        id="settings-page"
        variant={PageSectionVariants.light}
        className="pf-u-pr-0 pf-u-ml-lg pf-u-mr-sm"
        style={{ overflowY: "scroll", height: `calc(100vh - 319.2px)` }}
      >
        {!isDataLoading ? (
          <Sidebar isPanelRight className="pf-u-mt-lg">
            <SidebarPanel variant="sticky">
              <HelpTextWithIconLayout
                textComponent={TextVariants.p}
                textClassName="pf-u-mb-md"
                subTextComponent={TextVariants.a}
                subTextIsVisitedLink={true}
                textContent="Help"
                icon={
                  <OutlinedQuestionCircleIcon className="pf-u-primary-color-100 pf-u-mr-sm" />
                }
              />
              <JumpLinks
                isVertical
                label="Jump to section"
                scrollableSelector="#settings-page"
                offset={220} // for masthead
                expandable={{ default: "expandable", md: "nonExpandable" }}
              >
                <JumpLinksItem key={0} href="#identity-settings">
                  Identity settings
                </JumpLinksItem>
                <JumpLinksItem key={1} href="#account-settings">
                  Account settings
                </JumpLinksItem>
                <JumpLinksItem key={2} href="#password-policy">
                  Password policy
                </JumpLinksItem>
                <JumpLinksItem key={3} href="#kerberos-ticket">
                  Kerberos ticket policy
                </JumpLinksItem>
                <JumpLinksItem key={4} href="#contact-settings">
                  Contact settings
                </JumpLinksItem>
                <JumpLinksItem key={5} href="#mailing-address">
                  Mailing address
                </JumpLinksItem>
                <JumpLinksItem key={6} href="#employee-information">
                  Employee information
                </JumpLinksItem>
                <JumpLinksItem key={7} href="#smb-services">
                  User attributes for SMB services
                </JumpLinksItem>
              </JumpLinks>
            </SidebarPanel>

            <SidebarContent className="pf-u-mr-xl">
              <Flex
                direction={{ default: "column" }}
                flex={{ default: "flex_1" }}
              >
                <TitleLayout
                  key={0}
                  headingLevel="h2"
                  id="identity-settings"
                  text="Identity settings"
                />
                <UsersIdentity
                  userData={userShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={1}
                  headingLevel="h2"
                  id="account-settings"
                  text="Account settings"
                />
                <UsersAccountSettings
                  userData={userShowData}
                  certData={certFindData}
                  radiusProxyData={radiusProxyData}
                  idpData={idpData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={2}
                  headingLevel="h2"
                  id="password-policy"
                  text="Password policy"
                />
                <UsersPasswordPolicy
                  pwpolicyData={pwpolicyShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={3}
                  headingLevel="h2"
                  id="kerberos-ticket"
                  text="Kerberos ticket"
                />
                <UsersKerberosTicket
                  krbtpolicyData={krbtpolicyShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={4}
                  headingLevel="h2"
                  id="contact-settings"
                  text="Contact settings"
                />
                <UsersContactSettings
                  userData={userShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={5}
                  headingLevel="h2"
                  id="mailing-address"
                  text="Mailing address"
                />
                <UsersMailingAddress
                  userData={userShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={6}
                  headingLevel="h2"
                  id="employee-information"
                  text="Employee information"
                />
                <UsersEmployeeInfo
                  uidsData={uidsData}
                  userData={userShowData}
                  attrLevelRights={attrLevelRights}
                />
                <TitleLayout
                  key={7}
                  headingLevel="h2"
                  id="smb-services"
                  text="User attributes for SMB services"
                />
                <UsersAttributesSMB
                  userData={userShowData}
                  attrLevelRights={attrLevelRights}
                />
              </Flex>
            </SidebarContent>
          </Sidebar>
        ) : (
          spinner
        )}
      </PageSection>
      <ToolbarLayout
        isSticky={true}
        className={"pf-u-p-md pf-u-ml-lg pf-u-mr-lg"}
        toolbarItems={toolbarFields}
      />
      {isModalErrorOpen && (
        <ErrorModal
          title={errorTitle}
          isOpen={isModalErrorOpen}
          onClose={onCloseErrorModal}
          actions={errorModalActions}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
};

export default UserSettings;
