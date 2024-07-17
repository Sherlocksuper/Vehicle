import Login from "@/views/login";
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx";
import SystemTotalPage from "@/views/demo";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { ReactElement } from "react";
import userUtils from "@/utils/userUtils.ts";
import PhyTopology from "@/views/demo/topology/PhyTopology.tsx";
import UserManage from "@/views/demo/User/UserList.tsx";
import TestProject from "@/views/demo/TestProcessN/TestProject/TestProject.tsx";
import TestTemplate from "@/views/demo/TestProcessN/TestTemplate/TestTemplate.tsx";
import TestVehicle from "@/views/demo/TestProcessN/TestVehicle/TestVehicle.tsx";
import ConfigTestTemplate from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import TestProcessN from "@/views/demo/TestProcessN/TestProcessN.tsx";
import OfflineDate from "@/views/demo/OffLine/offline.tsx";
import OfflineShow from "@/views/demo/OffLine/OfflineShow.tsx";
import History from "@/views/demo/History/history.tsx";
import HistoryData from "@/views/demo/History/history.tsx";

interface RouteItem {
  key: string;
  label: string;
  element?: ReactElement;
  children?: RouteItem[];
}

export const routeItems: RouteItem[] = [
    {
        key: '/physical-topology',
        label: '测试板卡信息管理',
        element: <PhyTopology/>
    },
    {
        //测试预配置
        key: '/test-config',
        label: '测试预配置',
        element: <Outlet/>,
        children: [
            {
                key: '/test-config/test-vehicle',
                label: '车辆管理',
                element: <TestVehicle/>
            },
            {
                key: '/test-config/test-config',
                label: '测试项目',
                element: <TestProject/>
            },
            {
                key: '/test-config/test-object',
                label: '测试模板',
                element: <TestTemplate/>
            },
        ]
    },
    {
        key: '/process-execution',
        label: '测试配置生成',
        element: <TestProcessN/>
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
        key: '/user-management',
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
            path: '/test-template-config',
            element: <DndProvider backend={HTML5Backend}>
                <ConfigTestTemplate/>,
            </DndProvider>
        },
        {
            path: '/offline-show',
            element: <DndProvider backend={HTML5Backend}>
                <OfflineShow/>,
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