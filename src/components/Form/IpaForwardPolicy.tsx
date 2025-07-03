import React from "react";
// PatternFly
import { Flex, FlexItem, Radio } from "@patternfly/react-core";
// Utils
import {
  getParamProperties,
  IPAParamDefinition,
  updateIpaObject,
} from "src/utils/ipaObjectUtils";

const IpaForwardPolicy = (props: IPAParamDefinition) => {
  const { readOnly, value } = getParamProperties(props);

  // States
  const [isFwdFirstChecked, setIsFwdFirstChecked] = React.useState<boolean>(
    value === "first"
  );
  const [isFwdOnlyChecked, setIsFwdOnlyChecked] = React.useState<boolean>(
    value === "only"
  );

  const [isFwdingDisabled, setIsFwdingDisabled] = React.useState<boolean>(
    value === "none"
  );

  React.useEffect(() => {
    validateChange(value as string);
  }, [value]);

  // Manage radio button changes
  const validateChange = (newValue: string) => {
    if (props.ipaObject && props.onChange) {
      if (newValue === "first") {
        setIsFwdFirstChecked(true);
        setIsFwdOnlyChecked(false);
        setIsFwdingDisabled(false);
      } else if (newValue === "only") {
        setIsFwdFirstChecked(false);
        setIsFwdOnlyChecked(true);
        setIsFwdingDisabled(false);
      } else if (newValue === "none") {
        setIsFwdFirstChecked(false);
        setIsFwdOnlyChecked(false);
        setIsFwdingDisabled(true);
      }
      updateIpaObject(props.ipaObject, props.onChange, newValue, props.name);
    }
  };

  return (
    <Flex>
      <FlexItem>
        <Radio
          id={"forward-first"}
          key={"forward-first"}
          name={props.name + "-first"}
          label={"Forward first"}
          value={"first"}
          readOnly={readOnly}
          onChange={() => validateChange("first")}
          isChecked={isFwdFirstChecked}
        />
      </FlexItem>
      <FlexItem>
        <Radio
          id={"forward-only"}
          key={"forward-only"}
          name={props.name + "-only"}
          label={"Forward only"}
          value={"only"}
          readOnly={readOnly}
          onChange={() => validateChange("only")}
          isChecked={isFwdOnlyChecked}
        />
      </FlexItem>
      <FlexItem>
        <Radio
          id={"forwarding-disabled"}
          key={"forwarding-disabled"}
          name={props.name + "-none"}
          label={"Forwarding disabled"}
          value={"none"}
          readOnly={readOnly}
          onChange={() => validateChange("none")}
          isChecked={isFwdingDisabled}
        />
      </FlexItem>
    </Flex>
  );
};

export default IpaForwardPolicy;
