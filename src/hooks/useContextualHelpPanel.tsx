import { useState, useCallback, useMemo } from "react";

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

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const changePage = useCallback((page: string) => {
    setFromPage(page);
  }, []);

  const panelProps = useMemo<ContextualHelpPanelProps>(
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
