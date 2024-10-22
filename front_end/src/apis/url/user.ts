import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";


export const USER: UrlMap = {
    login: {
        url: '/login',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    logout: {
        url: '/logout',
        method: Method.POST,
        format: ContentType.WWW_FORM
    },
    changePassword: {
        url: '/changePassword',
        method: Method.POST,
        format: ContentType.WWW_FORM
    }
}
