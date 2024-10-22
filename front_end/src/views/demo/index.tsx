import React from 'react';
import './index.css';
import { Flex, FloatButton, Modal } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { HomeMenu } from "@/views/demo/IndexMenu.tsx";
import {
    LoginOutlined, UserOutlined
} from "@ant-design/icons";
import { logout } from "@/apis/request/auth.ts";


const SystemTotalPage: React.FC = () => {
    const [open, setOpen] = React.useState(false);

    const [modalApi, modalHandler] = Modal.useModal()
    const navigate = useNavigate()

    const switchOpen = () => {
        setOpen(open => !open)
    }

    return (
        <Flex className={"screen_max"} flex={1} align={"start"} vertical={false}>
            <HomeMenu />
            <div style={{
                width: '85vw',
                height: '100vh',
            }}>
                <Outlet />
            </div>
            {
                <>
                    <FloatButton.Group
                        open={open}
                        trigger="click"
                        style={{ right: 24 }}
                        icon={<UserOutlined />}
                        onClick={switchOpen}
                    >

                        <FloatButton icon={<LoginOutlined style={{ color: "red" }} />} tooltip={"退出"} onClick={() => {
                            if (window.confirm("确定退出登录吗？"))
                                logout().then(() => {
                                    navigate('/login')
                                })
                        }} />
                        {modalHandler}
                    </FloatButton.Group>
                </>
            }
        </Flex>
    );
};

export default SystemTotalPage;
