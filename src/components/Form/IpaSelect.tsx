import React from "react";
// PatternFly
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
// Utils
import {
  IPAParamDefinition,
  getParamProperties,
} from "src/utils/ipaObjectUtils";
import { updateIpaObject } from "src/utils/ipaObjectUtils";
import { NO_SELECTION_OPTION } from "src/utils/constUtils";

interface IPAParamDefinitionSelect extends IPAParamDefinition {
  id?: string;
  setIpaObject?: (ipaObject: Record<string, unknown>) => void;
  variant?:
    | "default"
    | "plain"
    | "primary"
    | "plainText"
    | "secondary"
    | "typeahead";
  options: string[];
  ariaLabelledBy?: string;
}

const IpaSelect = (props: IPAParamDefinitionSelect) => {
  // Obtains the metadata of the parameter
  const { readOnly, value } = getParamProperties(props);

  // Handle selected value
  let valueSelected = NO_SELECTION_OPTION;
  if (value !== undefined && value && value !== "") {
    valueSelected = value.toString();
  }

  const ipaObject = props.ipaObject || {};

  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    selection: string | number | undefined
  ) => {
    let valueToUpdate = "";

    if (selection !== NO_SELECTION_OPTION) {
      valueToUpdate = selection as string;
    }

    if (ipaObject && props.setIpaObject !== undefined) {
      updateIpaObject(ipaObject, props.setIpaObject, valueToUpdate, props.name);
    }

    setIsOpen(false);
  };

  // Provide empty option at the beginning of the list
  // const optionsToSelect: string[] = [...(props.options || [])];
  // optionsToSelect.unshift(NO_SELECTION_OPTION);
  const [optionsToSelect, setOptionsToSelect] = React.useState<string[]>(
    props.options || []
  );
  // Add empty option at the beginning of the list
  // optionsToSelect.unshift(NO_SELECTION_OPTION);

  // Toggle
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      isDisabled={readOnly}
      variant={props.variant || "default"}
      className="pf-v5-u-w-100"
    >
      {valueSelected}
    </MenuToggle>
  );

  React.useEffect(() => {
    console.log("optionsToSelect: ", optionsToSelect);
    // Add empty option at the beginning of the list
    if (optionsToSelect[0] !== NO_SELECTION_OPTION) {
      optionsToSelect.unshift(NO_SELECTION_OPTION);
    }
  }, [optionsToSelect]);

  React.useEffect(() => {
    console.log("props.options: ", props.options);

    // Add empty option at the beginning of the list
    // optionsToSelect.unshift(NO_SELECTION_OPTION);
    if (props.options !== optionsToSelect) {
      const optionsTemp = [...props.options];
      setOptionsToSelect(optionsTemp || []);
      optionsTemp.unshift(NO_SELECTION_OPTION);
    }
  }, [props.options]);

  return (
    <Select
      id={props.id}
      aria-label={props.name}
      // toggle={(_event, val) => setIsOpen(val)}
      toggle={toggle}
      onOpenChange={(isOpen) => setIsOpen(isOpen)}
      onSelect={onSelect}
      // selections={valueSelected}
      isOpen={isOpen}
      aria-labelledby={props.ariaLabelledBy || props.id}
      // readOnly={readOnly}
      // isDisabled={readOnly}
      // required={required}
    >
      <SelectList>
        {/* {optionsToSelect.map((option, index) => {
          console.log(option);
          return <SelectOption key={index} value={option} />;
        })} */}
        {optionsToSelect.map((option, index) => {
          return (
            <SelectOption key={index} value={option}>
              {option}
            </SelectOption>
          );
        })}
      </SelectList>
    </Select>
  );
};

export default IpaSelect;
