import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {TEST_PROCESSN_API} from "@/apis/url/testProcessN.ts";
import {request} from "@/utils/request.ts";
import {PROCESS_CONFIG_HINT} from "@/constants/process_hint.ts";

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
    const api = {...TEST_PROCESSN_API.getTestProcessNById};
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
    });
}

export const updateProcessN = (id: number, processN: ITestProcessN) => {
    const api = {...TEST_PROCESSN_API.updateTestProcessN};
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: processN
    });
}

export const deleteProcessN = (id: number) => {
    const api = {...TEST_PROCESSN_API.deleteTestProcessN};
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
    });
}

//加载三秒
export const downProcessN = (processN: ITestProcessN) => {
    const api = TEST_PROCESSN_API.downTestProcessN;
    return request({
        api: api,
        params: processN
    });
}

export const stopCurrentProcessN = () => {
    const api = TEST_PROCESSN_API.stopCurrentTestProcessN;
    return request({
        api: api
    });
}

export const getCurrentProcessN = () => {
    const api = TEST_PROCESSN_API.getCurrentTestProcessN
    return request({
        api: api
    })
}
