//router.get('/getTestProcessNList', TestProcessNController.getAllTestProcessNs)
// router.post('/createTestProcessN', TestProcessNController.createTestProcessN)
// router.get('/getTestProcessNById/:id', TestProcessNController.getTestProcessN)
// router.post('/updateTestProcessN/:id', TestProcessNController.updateTestProcessN)
// router.post('/deleteTestProcessN/:id', TestProcessNController.deleteTestProcessN)

import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const TEST_PROCESSN_API: UrlMap = {
    getTestProcessNList: {
        url: '/getTestProcessNList',
        method: Method.GET,
        format: ContentType.JSON
    },
    createTestProcessN: {
        url: '/createTestProcessN',
        method: Method.POST,
        format: ContentType.JSON
    },
    getTestProcessNById: {
        url: '/getTestProcessNById/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
    updateTestProcessN: {
        url: '/updateTestProcessN/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteTestProcessN: {
        url: '/deleteTestProcessN/:id',
        method: Method.POST,
        format: ContentType.JSON
    }
}