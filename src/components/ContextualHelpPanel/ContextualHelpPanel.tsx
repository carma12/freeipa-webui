import React from "react";
// PatternFly
import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
  List,
  ListItem,
} from "@patternfly/react-core";
// JSON
import DocumentationLinks from "src/assets/documentation/documentation-links.json";
// Icons
import ExternalLinkAltIcon from "@patternfly/react-icons/dist/esm/icons/external-link-alt-icon";
// Components
import TextLayout from "../layouts/TextLayout";

export interface DocLink {
  name: string;
  url: string;
}

interface ContextualHelpPanelProps {
  fromPage: string;
  isExpanded: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ContextualHelpPanel = (props: ContextualHelpPanelProps) => {
  // URLs from JSON
  const [urlList, setUrlList] = React.useState<DocLink[]>([]);

  React.useEffect(() => {
    const urlList: DocLink[] = [];
    switch (props.fromPage) {
      case "active-users":
        DocumentationLinks["active-users"].map((entry) => {
          urlList.push({
            name: entry.name,
            url: entry.url,
          });
        });
        setUrlList(urlList);
        break;
      // TODO: Add rest of the cases for the links data (based on key)
      default:
        setUrlList([]);
        break;
    }
  }, []);

  const drawerRef = React.useRef<HTMLDivElement>(null);

  const onExpand = () => {
    drawerRef.current && drawerRef.current.focus();
  };

  const listOfDocLinks = urlList.map((linkEntry, idx) => {
    return (
      <ListItem key={"link-" + idx} icon={<ExternalLinkAltIcon />}>
        <a href={linkEntry.url} target="_blank" rel="noreferrer">
          {linkEntry.name}
        </a>
      </ListItem>
    );
  });

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead id="contextual-help-panel-header">
        <span tabIndex={props.isExpanded ? 0 : -1} ref={drawerRef}>
          <TextLayout component="h2">Links</TextLayout>
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={props.onClose} />
        </DrawerActions>
        <DrawerPanelBody id="contextual-help-panel-body">
          <List isPlain>{listOfDocLinks}</List>
        </DrawerPanelBody>
      </DrawerHead>
    </DrawerPanelContent>
  );

  return (
    <Drawer
      isExpanded={props.isExpanded}
      onExpand={onExpand}
      id="contextual-help-panel"
    >
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{props.children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ContextualHelpPanel;