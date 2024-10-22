import {loginParams} from "@/apis/standard/auth.ts";
import {request} from "@/utils/request.ts";
import {MyUrl} from "@/apis/url/myUrl.ts";


export const loginApi = async (data: loginParams) => {
    const api = MyUrl.USER.login;
    const response = await request({
        api: api,
        params: data
    });
    return response
}

export const logout = async () => {
    const api = MyUrl.USER.logout;
    return request({
        api: api
    });
}
