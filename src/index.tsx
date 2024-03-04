import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
// react router dom
import { BrowserRouter } from "react-router-dom";
// Redux
import store from "./store/store";
import { Provider } from "react-redux";
// PatternFly utilities
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Text/text.css";
import "@patternfly/patternfly/utilities/Sizing/sizing.css";
import "@patternfly/patternfly/utilities/Display/display.css";
import "@patternfly/patternfly/utilities/Accessibility/accessibility.css";
// i18n
import i18n from "src/i18n/i18n";
import { I18nextProvider } from "react-i18next";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
