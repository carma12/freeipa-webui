import { useState, useCallback, useMemo } from "react";
// Components
import { ContextualHelpPanelProps } from "src/components/ContextualHelpPanel/ContextualHelpPanel";

interface UseContextualHelpPanelOptions {
  defaultPage?: string;
}

type PanelProps = Omit<ContextualHelpPanelProps, "children">;

interface UseContextualHelpPanelReturn {
  isExpanded: boolean;
  fromPage: string;
  toggle: () => void;
  close: () => void;
  changePage: (page: string) => void;
  panelProps: PanelProps;
}

function useContextualHelpPanel(
  options: UseContextualHelpPanelOptions = {}
): UseContextualHelpPanelReturn {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fromPage, setFromPage] = useState(options.defaultPage ?? "");

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const changePage = useCallback((page: string) => {
    setFromPage(page);
  }, []);

  const panelProps = useMemo<PanelProps>(
    () => ({
      fromPage,
      isExpanded,
      onClose: close,
    }),
    [fromPage, isExpanded, close]
  );

  return {
    isExpanded,
    fromPage,
    toggle,
    close,
    changePage,
    panelProps,
  };
}

export default useContextualHelpPanel;
