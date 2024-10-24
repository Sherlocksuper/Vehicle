import Login from "@/views/login";
import RequireAuthRoute from "../components/RequireAuthRoute.tsx/index.tsx";
import SystemTotalPage from "@/views/demo";
import {createBrowserRouter, Outlet} from "react-router-dom";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import React, {ReactElement} from "react";
import PhyTopology from "@/views/demo/Topology/PhyTopology.tsx";
import ProtocolTable from "@/views/demo/ProtocolTable";
import TestConfig from "@/views/demo/TestConfig";
import TestTemplateForConfig from "@/views/demo/TestConfig/template.tsx";
import HistoryData from "@/views/demo/History/history.tsx";
import DataSee from "@/views/demo/DataSee/DataSee.tsx";


interface RouteItem {
  key: string;
  label: string;
  element?: ReactElement;
  children?: RouteItem[];
}

//@ts-ignore
export const routeItems: RouteItem[] = [
  {
    key: '/test-config',
    label: '测试任务及配置',
    element: <TestConfig/>
  },
  {
    //测试预配置
    key: '/test-receive',
    label: '数据接收与管理',
    element: <Outlet/>,
    children: [
      // {
      //   key: '/test-receive/view',
      //   label: <p
      //     onClick={() => {
      //       getCurrentTestConfig().then(res => {
      //         if (res.code === FAIL_CODE) {
      //           message.error(res.msg);
      //         } else {
      //           console.log(res.data);
      //           const config: ITestConfig = (res.data);
      //           if (config.id === undefined) {
      //             message.error("当前无测试配置");
      //             return
      //           }
      //           const win = window.open(`/test-template-for-config?testConfigId=${config?.id}`);
      //           if (!win) return
      //         }
      //       });
      //     }}>接收数据动态监视</p>,
      // },
      {
        key: '/test-receive/view',
        label: "数据接收与监视",
        element: <DataSee/>
      },
      // {
      //   key: '/test-receive/offline-management',
      //   label: '数据可视化分析',
      //   element: <OfflineDate/>
      // },
      // {
      //   key: '/test-receive/offline-management',
      //   label: '数据可视化分析',
      //   element: <DataAnalysis/>
      // },
      {
        key: '/test-receive/history',
        label: '数据分析与管理',
        element: <HistoryData/>,
      },
    ]
  },

  {
    //测试预配置
    key: '/test-info',
    label: '基础信息管理',
    element: <Outlet/>,
    children: [
      {
        key: '/test-info/protocol-management',
        label: '测试协议管理',
        element: <ProtocolTable/>
      },
      {
        key: '/test-info/physical-Topology',
        label: '测试板卡信息管理',
        element: <PhyTopology/>
      },
    ]
  },
  // userUtils.isRootUser() ? {
  //   key: '/User-management',
  //   label: '用户管理',
  //   element: <UserManage/>
  // } : {
  //   key: '', label: '', element: <></>
  // },
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
        <TestTemplateForConfig dataMode={"ONLINE"}/>,
      </DndProvider>
    },
    {
      path: '/offline-show',
      element: <DndProvider backend={HTML5Backend}>
        <TestTemplateForConfig dataMode={"OFFLINE"}/>,
      </DndProvider>
    },
    {
      path: "/",
      element: <RequireAuthRoute><SystemTotalPage/></RequireAuthRoute>,
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
