import { useState, useMemo } from "react";

interface UseContextualHelpPanelOptions {
  defaultPage?: string;
}

interface ContextualHelpPanelProps {
  fromPage: string;
  isExpanded: boolean;
  onClose: () => void;
}

interface UseContextualHelpPanelReturn {
  isExpanded: boolean;
  fromPage: string;
  toggle: () => void;
  close: () => void;
  changePage: (page: string) => void;
  panelProps: ContextualHelpPanelProps;
}

export function useContextualHelpPanel(
  options: UseContextualHelpPanelOptions = {}
): UseContextualHelpPanelReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromPage, setFromPage] = useState(options.defaultPage ?? "");

  const toggle = () => setIsExpanded((prev) => !prev);
  const close = () => setIsExpanded(false);

  const panelProps = useMemo<ContextualHelpPanelProps>(
    () => ({
      fromPage,
      isExpanded,
      onClose: () => setIsExpanded(false),
    }),
    [fromPage, isExpanded]
  );

  return {
    isExpanded,
    fromPage,
    toggle,
    close,
    changePage: setFromPage,
    panelProps,
  };
}
