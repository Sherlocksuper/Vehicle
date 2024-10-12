import React from "react";
import {Form, Menu, MenuProps, Modal, Input, message} from "antd";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {logout} from "@/apis/request/auth.ts";
import {changePassword} from "@/apis/request/user.ts";
import {FAIL_CODE, SUCCESS_CODE} from "@/constants";
import userUtils from "@/utils/userUtils.ts";
import {routeItems} from "@/routes";
import {getCurrentTestConfig} from "@/apis/request/testConfig.ts";
import {ITestConfig} from "@/apis/standard/test.ts";

export const HomeMenu = () => {
    const navigate: NavigateFunction = useNavigate()
    const [visible, setVisible] = React.useState(false)
    const [form] = Form.useForm()
    const items = routeItems.map(item => ({
        key: item.key,
        label: item.label,
        children: item.children,
    }));


    const onClick: MenuProps['onClick'] = (e) => {
        if (e.key !== 'avatar' && e.key !== 'logout' && e.key !== 'changePassword' && e.key !== '/test-receive/view')
            navigate(e.key as string)
        else if (e.key === 'logout') {
            if (window.confirm("确定退出登录吗？"))
                logout().then(() => {
                    userUtils.removeUserInfo()
                    navigate('/login')
                })
        } else if (e.key === 'changePassword') {
            setVisible(true)
        } else if (e.key === '/test-receive/view') {
            getCurrentTestConfig().then(res => {
                if (res.code === FAIL_CODE) {
                    message.error(res.msg);
                } else {
                    console.log(res.data);
                    const config: ITestConfig = (res.data);
                    if (config === null || config.id === undefined) {
                        message.error("当前无测试配置");
                        return
                    }
                    const win=window.open(`/test-template-for-config?testConfigId=${config.id}`, '_blank')
                    if (!win) return;
                }
            })
        }
    }

    const onFinish = async () => {
        const newPass = form.getFieldValue("newPassword")
        const confirmPass = form.getFieldValue("confirmPassword")

        if (newPass !== confirmPass) {
            alert("两次输入密码不一致")
            return
        }

        changePassword({password: newPass}).then((response) => {
            if (response.code === SUCCESS_CODE) {
                alert("修改成功")
            } else {
                alert(response.msg)
            }
        })
        setVisible(false)
    }

    return <>
        <Menu
            onClick={onClick}
            style={{width: '15vw', minHeight: '100vh', height: 'auto'}}
            defaultSelectedKeys={[window.location.pathname]}
            mode="inline"
            items={items}
            defaultOpenKeys={items.map(item => item.key)}
        />

        <Modal open={visible} onOk={onFinish} onCancel={() => setVisible(false)}>
            <Form form={form} style={{width: '30vw'}}>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{required: true, message: '请输入新密码'}]}
                >
                    <Input.Password placeholder="New Password" name="newPassword"/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{required: true, message: '请确认输入新密码'}]}
                >
                    <Input.Password placeholder="Confirm Password" name="confirmPassword"/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}
