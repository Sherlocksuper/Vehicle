import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {TEST_PROCESSN_API} from "@/apis/url/testProcessN.ts";
import {request} from "@/utils/request.ts";
import {PROCESS_CONFIG_HINT} from "@/constants/process_hint.ts";
import {NewTestTemplateMode} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {message} from "antd";

////router.get('/getTestProcessNList', TestProcessNController.getAllTestProcessNs)
// // router.post('/createTestProcessN', TestProcessNController.createTestProcessN)
// // router.get('/getTestProcessNById/:id', TestProcessNController.getTestProcessN)
// // router.post('/updateTestProcessN/:id', TestProcessNController.updateTestProcessN)
// // router.post('/deleteTestProcessN/:id', TestProcessNController.deleteTestProcessN)

export const createProcessN = (processN: ITestProcessN) => {
    const api = TEST_PROCESSN_API.createTestProcessN;
    return request({
        api: api,
        params: processN
    });
}

export const getProcessNList = () => {
    const api = TEST_PROCESSN_API.getTestProcessNList;
    return request({
        api: api
    });
}

export const getProcessNById = (id: number) => {
    const api = TEST_PROCESSN_API.getTestProcessNById;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
    });
}

export const updateProcessN = (id: number, processN: ITestProcessN) => {
    const api = TEST_PROCESSN_API.updateTestProcessN;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: processN
    });
}

export const deleteProcessN = (id: number) => {
    const api = TEST_PROCESSN_API.deleteTestProcessN;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
    });
}

export const downProcessN = (processN: ITestProcessN) => {
    //加载三秒
    return new Promise((resolve, reject) => {
        message.loading({content: "加载中...", key: 'processN', duration: 0})
        setTimeout(() => {
            localStorage.setItem('processN', JSON.stringify(processN));
            message.success({content: "下发成功", key: 'processN', duration: 2})
            resolve(processN);
        }, 3000);
    });
}

export const stopCurrentProcessN = () => {
    return new Promise((resolve, reject) => {
        message.loading({content: "加载中...", key: 'processN', duration: 0})
        setTimeout(() => {
            localStorage.removeItem('processN');
            message.success({content: "停止成功", key: 'processN', duration: 2})
            resolve(true);
        }, 3000);
    })
}

export const getCurrentProcessN = () => {
    const processN = localStorage.getItem('processN');
    return processN ? JSON.parse(processN) : null;
}

export const checkCurrentProcessN = (record:ITestProcessN) => {
    const testProcessNRecord = JSON.stringify(record)
    if (!confirm("" + PROCESS_CONFIG_HINT)) return
    window.open(`/test-template-config?testProcessNRecord=${testProcessNRecord}&model=${NewTestTemplateMode.SHOW}`)
}
