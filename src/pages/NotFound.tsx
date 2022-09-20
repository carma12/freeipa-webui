import * as React from "react";
// PatternFly
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
import {
  PageSection,
  Title,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
} from "@patternfly/react-core";
// React router dom
import { useNavigate } from "react-router-dom";

const NotFound: React.FunctionComponent = () => {
  // Button redirection to 'home'
  function GoHomeBtn() {
    const navigate = useNavigate();
    function handleClick() {
      navigate("/");
    }
    return <Button onClick={handleClick}>Take me home</Button>;
  }

  // Renders 'NotFound' page
  return (
    <PageSection>
      <EmptyState variant="full">
        <EmptyStateIcon icon={ExclamationTriangleIcon} />
        <Title headingLevel="h1" size="lg">
          404 Page not found
        </Title>
        <EmptyStateBody>
          We didn&apos;t find a page that matches the address you navigated to.
        </EmptyStateBody>
        <GoHomeBtn />
      </EmptyState>
    </PageSection>
  );
};

export default NotFound;
