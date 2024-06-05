import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {TEST_PROCESSN_API} from "@/apis/url/testProcessN.ts";
import {request} from "@/utils/request.ts";

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

