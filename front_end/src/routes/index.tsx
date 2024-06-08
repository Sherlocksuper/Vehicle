import Login from "@/views/login"
import RequirAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx"
import SystemTotalPage from "@/views/demo";
import {createBrowserRouter, Outlet} from "react-router-dom";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {ReactElement} from "react";
import userUtils from "@/utils/userUtils.ts";
import PhyTopology from "@/views/demo/Topology/PhyTopology.tsx";
import UserManage from "@/views/demo/User/UserList.tsx";
import TestProject from "@/views/demo/TestProcessN/TestProject/TestProject.tsx";
import TestTemplate from "@/views/demo/TestProcessN/TestTemplate/TestTemplate.tsx";
import TestVehicle from "@/views/demo/TestProcessN/TestVehicle/TestVehicle.tsx";
import NewTestTemplate from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";
import TestProcessN from "@/views/demo/TestProcessN/TestProcessN.tsx";
import OfflineDate from "@/views/demo/OffLine/offline.tsx";

interface RouteItem {
    key: string
    label: string
    element?: ReactElement,
    children?: RouteItem[]
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
        key:'/offline',
        label:'离线数据展示',
        element:<OfflineDate/>
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
                <NewTestTemplate/>,
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