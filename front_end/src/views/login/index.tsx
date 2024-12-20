import React, {useEffect} from 'react';
import {Form, Input, Button, message} from 'antd';
import './index.css';
import {useNavigate} from 'react-router-dom';
import {loginApi} from "@/apis/request/auth.ts";
import {loginParams} from "@/apis/standard/auth.ts";
import {throttle} from "@/utils";
import {useForm} from "antd/es/form/Form";
import {changePassword} from "@/apis/request/user.ts";
import {SUCCESS_CODE} from "@/constants";
import UserUtils from "@/utils/userUtils.ts";
import userUtils from '@/utils/userUtils.ts';

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = React.useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (userUtils.getToken()) {
            console.log("token:" + userUtils.getToken())
            navigate('/test-info/protocol-management', {replace: true})
        }
    }, [])

    return (
        <div className="login-container">
            <div className="background-image"></div>
            <div className="login-content">
                <h1>车辆数据采集系统</h1>
                {isLogin ? <ToLogin/> : <ChangePassword/>}
            </div>
        </div>
    );
};

const ChangePassword = () => {
    const [form] = useForm()
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
    }

    return (
        <div>
            <Form form={form}>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{required: true, message: '请输入新密码'}]}
                >
                    <Input.Password placeholder="New Password"/>
                </Form.Item>
                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    rules={[{required: true, message: '请确认输入新密码'}]}
                >
                    <Input.Password placeholder="Confirm Password"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-button" onClick={onFinish}>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

const ToLogin = () => {
    const navigate = useNavigate()
    const [messageApi, messageHandler] = message.useMessage()
    const onLogin = async (data: loginParams) => {
        try {

            const response = await loginApi(data)
            if (response.code === SUCCESS_CODE && response.data != null && !response.data.disabled) {
                navigate('/test-info/protocol-management', {replace: true})
            } else {

                if (response.data?.disabled) {
                    messageApi.error("登录失败，该用户不存在或已被禁用")
                } else {
                    messageApi.error(response?.msg)
                }

                UserUtils.removeUserInfo()
            }

        } catch (error) {
            console.error(error)
        }
    }

    const onFinish = async (formData: FormData) => {
        console.log('Received values of form: ', formData)
        const data: loginParams = {
            username: formData.username,
            password: formData.password
        }
        await onLogin(data)
    };
    return <Form
        name="login-form"
        onFinish={throttle(onFinish, 1000)}
        initialValues={{remember: true}}
    >
        {messageHandler}
        <Form.Item
            name="username"
            rules={[{required: true, message: 'Please input your username!'}]}
        >
            <Input placeholder="Username"/>
        </Form.Item>
        <Form.Item
            name="password"
            rules={[{required: true, message: 'Please input your password!'}]}
        >
            <Input.Password placeholder="Password"/>
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
                登录
            </Button>
        </Form.Item>
    </Form>
}

export default Login;
