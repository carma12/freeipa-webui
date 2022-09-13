// Pages
import ActiveUsers from "pages/ActiveUsers/ActiveUsers";
import ActiveUsersTabs from "pages/ActiveUsers/ActiveUsersTabs";
import ActiveUsersThirdLevelPage from "pages/ActiveUsers/ActiveUsersThridLevelPage";
import StageUsers from "pages/StageUsers/StageUsers";
import StageUsersTabs from "pages/StageUsers/StageUsersTabs";
import PreservedUsers from "pages/PreservedUSers/PreservedUsers";
// import PreservedUsersTabs from "../components/PreservedUsersTabs";
// import Hosts from "../pages/Hosts";
// import Services from "../pages/Services";
// import UserGroups from "../pages/UserGroups";
// import HostGroups from "../pages/HostGroups";
// import NetGroups from "../pages/Netgroups";
// import IDViews from "../pages/IDViews";
// import UserGroupRules from "../pages/UserGroupRules";
// import HostGroupRules from "../pages/HostGroupRules";
// Routes
import { RouteConfig } from "./routeTypes";

export const routesIdentity: RouteConfig[] = [
  {
    label: "Users",
    groupId: "grp-1",
    visible: true,
    type: "NavGroup",
    routes: [
      {
        component: ActiveUsers,
        exact: true,
        label: "Active users",
        path: "/active-users",
        title: "FreeIPA | Active users",
        groupId: "grp-1",
        visible: true,
        type: "NavItem",
        routes: [
          {
            component: ActiveUsersTabs,
            exact: true,
            label: "Active users Settings",
            path: "/active-users/settings",
            title: "FreeIPA | Active users settings",
            groupId: "grp-1",
            visible: false,
            type: "NavItem",
            routes: [
              {
                component: ActiveUsersThirdLevelPage,
            exact: true,
            label: "Active users third-level page",
            path: "/active-users/settings/third-level-page",
            title: "FreeIPA | Active users third-level page",
            groupId: "grp-1",
            visible: false,
            type: "NavItem",
              }
            ],
          },
        ],
      },
      {
        component: StageUsers,
        exact: true,
        label: "Stage users",
        path: "/stage-users",
        title: "FreeIPA | Stage users",
        groupId: "grp-1",
        visible: true,
        type: "NavItem",
        routes: [
          {
            component: StageUsersTabs,
            exact: true,
            label: "Stage users Settings",
            path: "/stage-users/settings",
            title: "FreeIPA | Stage users settings",
            groupId: "grp-1",
            visible: false,
            type: "NavItem",
          },
        ],
      },
      {
        component: PreservedUsers,
        exact: true,
        label: "Preserved users",
        path: "/preserved-users",
        title: "FreeIPA | Preserved users",
        groupId: "grp-1",
        visible: true,
        type: "NavItem",
        // routes: [
        //   {
        //     component: PreservedUsersTabs,
        //     exact: true,
        //     label: "Preserved users Settings",
        //     path: "/preserved-users/settings",
        //     title: "FreeIPA | Preserved users settings",
        //     groupId: "grp-1",
        //     visible: false,
        //     type: "NavItem",
        //   },
        // ],
      },
    ],
  },
  // {
  //   component: Hosts,
  //   exact: true,
  //   label: "Hosts",
  //   path: preUrl + "/hosts",
  //   title: "FreeIPA | Hosts",
  //   groupId: "grp-1",
  //   visible: true,
  //   type: "NavItem",
  // },
  // {
  //   component: Services,
  //   exact: true,
  //   label: "Services",
  //   path: preUrl + "/services",
  //   title: "FreeIPA | Services",
  //   groupId: "grp-1",
  //   visible: true,
  //   type: "NavItem",
  // },
  // {
  //   label: "Groups",
  //   groupId: "grp-1",
  //   visible: true,
  //   type: "NavGroup",
  //   routes: [
  //     {
  //       component: UserGroups,
  //       exact: true,
  //       label: "User Groups",
  //       path: preUrl + "/user-groups",
  //       title: "FreeIPA | User Groups",
  //       groupId: "grp-1",
  //       visible: true,
  //       type: "NavItem",
  //     },
  //     {
  //       component: HostGroups,
  //       exact: true,
  //       label: "Host Groups",
  //       path: preUrl + "/host-groups",
  //       title: "FreeIPA | Host Groups",
  //       groupId: "grp-1",
  //       visible: true,
  //       type: "NavItem",
  //     },
  //     {
  //       component: NetGroups,
  //       exact: true,
  //       label: "Netgroups",
  //       path: preUrl + "/netgroups",
  //       title: "FreeIPA | Netgroups",
  //       groupId: "grp-1",
  //       visible: true,
  //       type: "NavItem",
  //     },
  //   ],
  // },
  // {
  //   component: IDViews,
  //   exact: true,
  //   label: "ID views",
  //   path: preUrl + "/id-views",
  //   title: "FreeIPA | ID views",
  //   groupId: "grp-1",
  //   visible: true,
  //   type: "NavItem",
  // },
  // {
  //   label: "Automember",
  //   groupId: "grp-1",
  //   visible: true,
  //   type: "NavGroup",
  //   routes: [
  //     {
  //       component: UserGroupRules,
  //       exact: true,
  //       label: "User Group Rules",
  //       path: preUrl + "/user-group-rules",
  //       title: "FreeIPA | User Group Rules",
  //       groupId: "grp-1",
  //       visible: true,
  //       type: "NavItem",
  //     },
  //     {
  //       component: HostGroupRules,
  //       exact: true,
  //       label: "Host Group Rules",
  //       path: preUrl + "/host-group-rules",
  //       title: "FreeIPA | Host Group Rules",
  //       groupId: "grp-1",
  //       visible: true,
  //       type: "NavItem",
  //     },
  //   ],
  // },
];
