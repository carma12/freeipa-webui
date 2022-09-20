import React from "react";
// React router dom
import { Route, Routes } from "react-router-dom";
// Routes
import { RouteItem } from "./routes/routeTypes";
import { routesIdentity } from "./routes/identityRoutes";
// Pages
import NotFound from "pages/NotFound";

const AppRoutes = () => {
  // Component to render individual routes
  const GeneratedRoute = ({ component, path, ...rest }: RouteItem) => {
    // function isRouteSelected(route: RouteItem) {
    //   return route.path === location.pathname || isSelectedChildVisible(route)
    //     ? true
    //     : route.path === getParentUrl() &&
    //         route.routes !== undefined &&
    //         !isSelectedChildVisible(route);
    // }

    return <Route path={path} element={component} />;
  };

  // Page not found
  const PageNotFound = () => {
    return <Route element={NotFound} />;
  };

  return (
    <Routes>
      {/* {routesIdentity.map((path, element, idx) => (
        <GeneratedRoute path={path} component={element} key={idx} />
      ))} */}
      <PageNotFound />
    </Routes>
  );
};

export default AppRoutes;
