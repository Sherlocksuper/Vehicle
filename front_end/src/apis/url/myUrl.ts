import {USER} from "@/apis/url/user.ts";
import {TEST} from "@/apis/url/test.ts";
import {APIStandard} from "@/apis/standard/all.ts";

export const BASE_URL = import.meta.env.VITE_BASE_URL

export interface UrlMap {
    [key: string]: APIStandard;
}

export const MyUrl = {
    USER,
    TEST,
}
