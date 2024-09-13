// Then add these routes in your router configuration
import {ContentType, Method} from "@/apis/standard/all.ts";


export const TEST_CONFIG_API = {
// router.get('/getAllTestConfig', TestConfigController.getAllTestConfig);
    getTestConfigList: {
        url: '/getAllTestConfig',
        method: Method.GET,
        format: ContentType.JSON
    },
// router.post('/createTestConfig', TestConfigController.createTestConfig);
    createTestConfig: {
        url: '/createTestConfig',
        method: Method.POST,
        format: ContentType.JSON
    },
// router.get('/getTestConfig/:id', TestConfigController.getTestConfigById);
    getTestConfigById: {
        url: '/getTestConfig/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
// router.delete('/deleteTestConfig/:id', TestConfigController.deleteTestConfigById);
    deleteTestConfig: {
        url: '/deleteTestConfig/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
}
