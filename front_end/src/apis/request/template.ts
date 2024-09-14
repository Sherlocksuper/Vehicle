///**
//  * 测试模板管理接口 TestTemplate
//  * created by lby on 6.2
//  */
// router.get('/getTestTemplateList', TestTemplateController.getTestTemplateList)
// router.post('/createTestTemplate', TestTemplateController.createTestTemplate)
// router.post('/updateTestTemplate/:id', TestTemplateController.updateTestTemplate)
// router.get('/getTestTemplateById/:id', TestTemplateController.getTestTemplateById)
// router.post('/deleteTestTemplate/:id', TestTemplateController.deleteTestTemplate)

import {request} from "@/utils/request.ts";
import {TEMPLATE_API} from "@/apis/url/template.ts";
import {ITemplate} from "@/apis/standard/template.ts";


export const getTestTemplateList = async () => {
    const api = TEMPLATE_API.getTestTemplateList;
    return request({
        api: api
    });
}

export const createTestTemplate = async (template: ITemplate) => {
    return request({
        api: TEMPLATE_API.createTestTemplate,
        params: template
    });
}

export const updateTestTemplate = async (id: string, template: ITemplate) => {
    const api = {...TEMPLATE_API.getTestTemplateById}
    api.url = api.url.replace(':id', id);
    return request({
        api: TEMPLATE_API.updateTestTemplate,
        params: template
    });
}

export const getTestTemplateById = async (id: string) => {
    const api = {...TEMPLATE_API.getTestTemplateById}
    api.url = api.url.replace(':id', id);

    return request({
        api: api
    });
}

export const getDefaultTestTemplate = async () => {
    return await getTestTemplateById('1');
}

export const updateDefaultTestTemplate = async (template: ITemplate) => {
    return await updateTestTemplate('1', template);
}

export const deleteTestTemplate = async (id: string) => {
    const api = {...TEMPLATE_API.getTestTemplateById}
    api.url = api.url.replace(':id', id);
    return request({
        api: api
    });
}
