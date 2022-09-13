/* eslint-disable @typescript-eslint/no-explicit-any */
// import { RouteComponentProps } from "react-router-dom";
import {useParams} from 'react-router-dom';

export type RouteConfig = RouteItem | RouteGroup;

export interface RouteGroup {
  component?: React.ComponentType<any>;
  label: string;
  groupId: string;
  visible: boolean;
  type: "NavGroup";
  routes: RouteItem[];
}

export interface RouteItem {
  component: React.ComponentType<typeof useParams> | React.ComponentType<any>;
  exact: boolean;
  label: string;
  groupId: string;
  path: string;
  title: string;
  visible: boolean;
  type: "NavItem";
  routes?: RouteItem[];
}

// export const preUrl = "/freeipa-webui-sandbox";
