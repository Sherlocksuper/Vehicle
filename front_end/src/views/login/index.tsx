import React, {useEffect} from 'react';
import {Form, Input, Button, message} from 'antd';
import './index.css';
import {useNavigate} from 'react-router-dom';
import {loginApi} from "@/apis/request/auth.ts";
import {loginParams} from "@/apis/standard/auth.ts";
import {throttle} from "@/utils";
import {SUCCESS_CODE} from "@/constants";
import UserUtils from "@/utils/userUtils.ts";
import userUtils from '@/utils/userUtils.ts';

interface FormData {
    username: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        if (userUtils.getToken()) {
            message.success("检测到已经登录，正在跳转")
            navigate('/test-info/protocol-management', {replace: true})
        }
    }, [])

    return (
        <div className="login-container">
            <div className="background-image"></div>
            <div className="login-content">
                <h1>车辆数据采集系统</h1>
                {<ToLogin/>}
            </div>
        </div>
    );
};

const ToLogin = () => {
    const navigate = useNavigate()
    const onLogin = async (data: loginParams) => {
        try {
            const response = await loginApi(data)
            if (response.code === SUCCESS_CODE && response.data != null && !response.data.disabled) {
                navigate('/test-info/protocol-management', {replace: true})
            }
            // 如果登录成功，将用户信息保存到本地
            if (response.code === SUCCESS_CODE && response.data !== null) {
                userUtils.setToken(response.data.accessToken)
                message.success("登录成功"+response.data.accessToken)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const onFinish = async (formData: FormData) => {
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
