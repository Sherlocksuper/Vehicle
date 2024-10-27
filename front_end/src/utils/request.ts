import axios, {AxiosRequestConfig} from 'axios';
import {BASE_URL} from "@/apis/url/myUrl.ts";
import userUtils from "@/utils/userUtils.ts";
import {APIStandard, ContentType, ResponseType} from "@/apis/standard/all.ts";
import {FAIL_CODE, TOKEN_VALID_CODE} from "@/constants";
import {message} from "antd";
import {sleep} from "@/utils/index.ts";
// import { FAIL_CODE,  TOKEN_VALID_CODE } from '@/constants';
// import { message } from 'antd';
// import { sleep } from '.';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 0
})

//规则
//1.默认x-www-form-urlencoded,如果不传递format，就是默认的
//2.根据method判断放到data还是params
//3.根据format判断Content-Type
export const request = ({api, params}: {
    api: APIStandard,
    params?: any,
}) => {
    const url = api.url
    const method = api.method
    const format = api.format
    const responseType = api.responseType || ResponseType.JSON
    const timeOut =  api.timeOut

    const axiosConfig = getAxiosConfig(url, method, params, format || ContentType.WWW_FORM, responseType, timeOut)


    return axiosInstance(axiosConfig).then(response => {
        return response.data;
    }).catch(error => {
        console.error('There was an error with the request:', error);
    });
};

const getAxiosConfig = (url: string, method: string, params: any, format: ContentType, responseType: ResponseType, timeOut: number|null): AxiosRequestConfig => {
    return {
        baseURL: BASE_URL,
        headers: {
            'authorization': userUtils.getToken(),
            'Content-Type': format,
        },
        url: url,
        method: method,
        responseType: responseType,
        [shouldUseData(method) ? 'data' : 'params']: method === 'GET' ? params : getFormatData(format, params),
        timeout: timeOut
    }
}


function getFormatData(format: ContentType, params: any) {
    switch (format) {
        case ContentType.JSON:
            return JSON.stringify(params)
        case ContentType.FORM_DATA: {
            const formData = new FormData()

            for (const key in params) {
                formData.append(key, params[key])
            }
            return formData
        }
        case ContentType.WWW_FORM: {
            let paramsStr = '';
            for (const key in params) {
                paramsStr += `${key}=${params[key]}&`;
            }
            return paramsStr.slice(0, -1);
        }
        default:
            return params
    }
}

function shouldUseData(method: string) {
    return method === 'PUT' || method === 'POST' || method === 'DELETE' || method === 'PATCH';
}

axiosInstance.interceptors.response.use(async res => {
    if (res.data?.code && res.data.code !== TOKEN_VALID_CODE && res.data.code !== FAIL_CODE) {
        message.error(res.data.msg)
        message.loading('即将返回登录页面')
        userUtils.removeUserInfo()
        await sleep(3000)
        window.location.href = '/login'
    }
    return res
}, err => {
    return err
})
