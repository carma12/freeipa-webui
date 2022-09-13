import React from "react";

import "@patternfly/react-core/dist/styles/base.css";
import { AppLayout } from "./AppLayout";
// React router dom
import { Routes, Route, Navigate } from "react-router-dom";
// Pages
import ActiveUsers from "pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "pages/ActiveUsers/ActiveUsersTabs";
import ActiveUsersThirdLevelPage from "pages/ActiveUsers/ActiveUsersThridLevelPage";
import StageUsers from "pages/StageUsers/StageUsers";
import StageUsersTabs from "pages/StageUsers/StageUsersTabs";
import PreservedUsers from "pages/PreservedUSers/PreservedUsers";

const App: React.FunctionComponent = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="active-users" replace />} />
        <Route path="active-users" element={<ActiveUsers />} />
        <Route path="active-users/settings" element={<ActiveUsersTabs />} />
        <Route
          path="active-users/settings/third-level-page"
          element={<ActiveUsersThirdLevelPage />}
        />
        <Route path="stage-users" element={<StageUsers />} />
        <Route path="stage-users/settings" element={<StageUsersTabs />} />
        <Route path="preserved-users" element={<PreservedUsers />} />
      </Routes>
    </AppLayout>
  );
};

export default App;
