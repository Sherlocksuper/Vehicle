//// router.get('/getTestTemplateList', TestTemplateController.getTestTemplateList)
// // router.post('/createTestTemplate', TestTemplateController.createTestTemplate)
// // router.post('/updateTestTemplate/:id', TestTemplateController.updateTestTemplate)
// // router.get('/getTestTemplateById/:id', TestTemplateController.getTestTemplateById)
// // router.post('/deleteTestTemplate/:id', TestTemplateController.deleteTestTemplate)

import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const TEMPLATE_API: UrlMap = {
    getTestTemplateList: {
        url: '/getTestTemplateList',
        method: Method.GET,
        format: ContentType.JSON
    },
    createTestTemplate: {
        url: '/createTestTemplate',
        method: Method.POST,
        format: ContentType.JSON
    },
    updateTestTemplate: {
        url: '/updateTestTemplate/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    getTestTemplateById: {
        url: '/getTestTemplateById/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
    deleteTestTemplate: {
        url: '/deleteTestTemplate/:id',
        method: Method.POST,
        format: ContentType.JSON
    }
}