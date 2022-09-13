import React, { useState } from "react";
// PatternFly
import { Nav, NavExpandable, NavItem, NavList } from "@patternfly/react-core";
// React router dom
import { NavLink, useLocation } from "react-router-dom";
// Routes
import { RouteItem, RouteGroup } from "./routes/routeTypes";
import { routesIdentity } from "./routes/identityRoutes";
// import { routesPolicy } from "./routes/policyRoutes";

const NavigationRoutes = () => {
  const [activeGroup, setActiveGroup] = useState<string | undefined>("grp-1");
  const [activeItem, setActiveItem] = useState<string | undefined>(
    "grp-1_itm-1"
  );

  const location = useLocation();

  // Nav onSelect method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (result: any) => {
    setActiveGroup(result.groupId);
    setActiveItem(result.itemId);
    console.debug("Active group: ", activeGroup, ", Active item: ", activeItem);
  };

  // Obtain parent url
  // -- e.g: '/freeipa-webui-sandbox/active-users/settings' --> '/freeipa-webui-sandbox/active-users'
  const getParentUrl = () => {
    const urlSections = location.pathname.split("/");
    const lastSection = urlSections[urlSections.length - 1];
    let parentUrl = "";
    urlSections.map(
      (url) => url !== lastSection && (parentUrl = parentUrl + url + "/")
    );
    return "/" + urlSections[1];
  };

  // Returns if child is visible when URL is rendered
  const isSelectedChildVisible = (route: RouteItem) => {
    const actualUrl = location.pathname;
    let selectedChildVisible = false;
    if (route.routes !== undefined) {
      route.routes.map((child) => {
        if (child.path === actualUrl) {
          selectedChildVisible = child.visible;
        }
      });
    }
    return selectedChildVisible;
  };

  // Renders NavItem components and its subroutes
  const renderNavItem = (route: RouteItem, index: number) => {
    // - Get and render NavItem subroutes
    const subNavItemsArray: JSX.Element[] = [];
    let subNavItems;
    if (route.routes !== undefined) {
      route.routes.map((subRoute, subIdx) => {
        if (subRoute.visible) {
          subNavItems = (
            <NavItem
              key={`${subRoute.label}-${subIdx}`}
              id={`${subRoute.label}-${subIdx}`}
              groupId={subRoute.groupId}
              itemId={route.groupId + "_itm-" + index + "_subitm-" + subIdx}
              isActive={subRoute.path === location.pathname}
              to={subRoute.path}
            >
              <NavLink
                end={subRoute.exact}
                to={subRoute.path}
                style={{ color: "white" }}
              >
                {subRoute.label}
              </NavLink>
            </NavItem>
          );
          subNavItemsArray.push(subNavItems);
        }
      });
    }

    // - Get parent URL (useful for children routes)
    const parentUrl = getParentUrl();

    // - Render NavItems
    const navItem = (
      <NavItem
        key={`${route.label}-${index}`}
        id={`${route.label}-${index}`}
        groupId={route.groupId}
        itemId={route.groupId + "_itm-" + index}
        isActive={
          route.path === location.pathname
            ? true
            : route.path === parentUrl &&
              route.routes !== undefined &&
              !isSelectedChildVisible(route)
        }
        to={route.path}
      >
        <NavLink end={route.exact} to={route.path} style={{ color: "white" }}>
          {route.label}
        </NavLink>
      </NavItem>
    );

    // - Return NavItem and its children (if visible)
    return (
      <React.Fragment key={index + "-group"}>
        {navItem}
        {subNavItemsArray.map((subItem) => subItem)}
      </React.Fragment>
    );
  };

  // Renders NavGroup components
  const renderNavGroup = (group: RouteGroup, groupIndex: number) => {
    const parentUrl = getParentUrl();
    return (
      <NavExpandable
        key={`${group.label}-${groupIndex}`}
        id={`${group.label}-${groupIndex}`}
        groupId={group.groupId}
        title={group.label}
        isActive={group.routes.some((route) =>
          route.path === location.pathname || isSelectedChildVisible(route)
            ? true
            : route.path === parentUrl &&
              route.routes !== undefined &&
              !isSelectedChildVisible(route)
        )}
        isExpanded={group.routes.some((route) =>
          route.path === location.pathname || isSelectedChildVisible(route)
            ? true
            : route.path === parentUrl &&
              route.routes !== undefined &&
              !isSelectedChildVisible(route)
        )}
      >
        {group.routes.map(
          (route, idx) =>
            route.label && route.visible && renderNavItem(route, idx)
        )}
      </NavExpandable>
    );
  };

  // Render 'Navigation'
  return (
    <Nav onSelect={onSelect}>
      <NavList>
        <NavExpandable
          title="Identity"
          groupId="grp-1"
          isActive={activeGroup === "grp-1"}
          isExpanded={activeGroup === "grp-1"}
        >
          {routesIdentity.map(
            (route, idx) =>
              route.label &&
              route.visible &&
              (route.type === "NavItem"
                ? renderNavItem(route, idx)
                : renderNavGroup(route, idx))
          )}
        </NavExpandable>
        {/* <NavExpandable
          title="Policy"
          groupId="grp-2"
          isActive={activeGroup === "grp-2"}
          isExpanded={activeGroup === "grp-2"}
        >
          {routesPolicy.map(
            (route, idx) =>
              route.label &&
              route.visible &&
              (route.type === "NavItem"
                ? renderNavItem(route, idx)
                : renderNavGroup(route, idx))
          )}
        </NavExpandable> */}
      </NavList>
    </Nav>
  );
};

export default NavigationRoutes;
