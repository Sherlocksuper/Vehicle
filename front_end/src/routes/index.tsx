import Login from "@/views/login";
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx";
import SystemTotalPage from "@/views/demo";
import {createBrowserRouter, Outlet} from "react-router-dom";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import React, {ReactElement} from "react";
import userUtils from "@/utils/userUtils.ts";
import PhyTopology from "@/views/demo/Topology/PhyTopology.tsx";
import UserManage from "@/views/demo/User/UserList.tsx";
import VehicleTable from "@/views/demo/TestProcessN/TestVehicle/TestVehicle.tsx";
import HistoryData from "@/views/demo/History/history.tsx";
import ProtocolTable from "@/views/demo/ProtocolTable";
import TestConfig from "@/views/demo/TestConfig";
import TestTemplateForConfig from "@/views/demo/TestConfig/template.tsx";
import OfflineDate from "@/views/demo/OffLine/offline.tsx";

interface RouteItem {
  key: string;
  label: string;
  element?: ReactElement;
  children?: RouteItem[];
}

export const routeItems: RouteItem[] = [
  {
    //测试预配置
    key: '/test-config',
    label: '测试预配置',
    element: <Outlet/>,
    children: [
      {
        key: '/test-config/physical-Topology',
        label: '测试板卡信息管理',
        element: <PhyTopology/>
      },
      {
        key: '/test-config/protocol-management',
        label: '测试协议管理',
        element: <ProtocolTable/>
      },
      {
        key: '/test-config/test-vehicle',
        label: '车辆管理',
        element: <VehicleTable/>
      },
      {
        key: '/test-config/test-config',
        label: '测试配置',
        element: <TestConfig/>
      },
    ]
  },
  {
    key: '/offline-management',
    label: '离线数据管理',
    element: <OfflineDate/>
  },
  {
    key: '/history',
    label: '历史数据管理',
    element: <HistoryData/>
  },
  userUtils.isRootUser() ? {
    key: '/User-management',
    label: '用户管理',
    element: <UserManage/>
  } : {
    key: '', label: '', element: <></>
  },
].filter(item => item.key !== '')


export const my_router = createBrowserRouter([
    {
      path: "/login",
      element: <Login/>,
    },
    {
      //测试模板配置
      path: '/test-template-for-config',
      element: <DndProvider backend={HTML5Backend}>
        <TestTemplateForConfig/>,
      </DndProvider>
    },
    {
      path: '/offline-show',
      element: <DndProvider backend={HTML5Backend}>
        <TestTemplateForConfig/>,
      </DndProvider>
    },
    {
      path: "/",
      element: <RequirAuthRoute><SystemTotalPage/></RequirAuthRoute>,
      children: routeItems.map(item => ({
        path: item.key,
        element: item.element,
        children: item.children?.map(child => ({
          path: child.key,
          element: child.element
        })),
      })),
    }
  ]
)
