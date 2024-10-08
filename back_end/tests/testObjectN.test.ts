import run from '../app'
import request, {Agent} from 'supertest'
import BE_CONFIG from '../app/config/be_config'
import OT_CONFIG from '../app/config/ot_config'
import {Server} from 'http'
import {ITestObjectNModel} from "../app/model/2TestObjectN.model";
import {SUCCESS_CODE} from "../app/constants";

//router.get('/getTestObjectNList', TestTemplateController.getTestTemplateList)
// router.post('/createTestObjectN', TestTemplateController.createTestTemplate)
// router.post('/updateTestObjectN/:id', TestTemplateController.updateTestTemplate)
// router.get('/getTestObjectNById/:id', TestTemplateController.getTestTemplateById)
// router.post('/deleteTestObjectN/:id', TestTemplateController.deleteTestTemplate)

describe('测试测试对象（新）', () => {
    const testObj: ITestObjectNModel = {
        id: 1,
        title: 'test',
        vehicle: {
            vehicleName: 'vehicle',
            isDisabled: false
        },
        project: {
            projectName: 'project',
            projectConfig: [{
                controller: {
                    controllerName: 'controller',
                    controllerAddress: 'address',
                    userId: 1,
                    isDisabled: false
                },
                collector: {
                    collectorName: 'collector',
                    collectorAddress: 'address',
                    userId: 1,
                    isDisabled: false
                },
                signal: {
                    signalName: 'signal',
                    signalUnit: 'unit',
                    signalType: 'type',
                    remark: 'remark',
                    collectorId: 1,
                    innerIndex: 1
                }
            }]
        },
        template: {
            name: 'template',
            description: 'description',
            createdAt: new Date('2021-01-01'),
            updatedAt: new Date('2021-01-01'),
            itemConfig: []
        },
    }


    const newTestObj: ITestObjectNModel = {
        id: 1,
        title: 'test2',
        vehicle: {
            vehicleName: 'vehicle2',
            isDisabled: false
        },
        project: {
            projectName: 'project',
            projectConfig: [
                {
                    controller: {
                        controllerName: 'controller',
                        controllerAddress: 'address',
                        userId: 1,
                        isDisabled: false
                    },
                    collector: {
                        collectorName: 'collector',
                        collectorAddress: 'address',
                        userId: 1,
                        isDisabled: false
                    },
                    signal: {
                        signalName: 'signal',
                        signalUnit: 'unit',
                        signalType: 'type',
                        remark: 'remark',
                        collectorId: 1,
                        innerIndex: 1
                    }
                }
            ]
        },
        template: {
            name: 'template2',
            description: 'description2',
            createdAt: new Date('2021-01-01'),
            updatedAt: new Date('2021-01-01'),
            itemConfig: []
        },
    }

    let backendServer: Server
    let tokenRequest: Agent
    beforeAll(async () => {
        backendServer = await run(BE_CONFIG.BE_PORT!)
        // 登录root账户
        const {body: {data: {token}}} = await request(backendServer).post('/login').send({
            username: OT_CONFIG.TEST_ROOT_USERNAME,
            password: OT_CONFIG.TEST_ROOT_PASSWORD
        })
        tokenRequest = request.agent(backendServer).set('Authorization', token)
    })

    it('createTestObjectN', async () => {
        const {body} = await tokenRequest.post('/createTestObjectN').send(testObj)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('getTestObjectNById', async () => {
        const {body} = await tokenRequest.get(`/getTestObjectNById/${testObj.id}`)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('updateTestObjectN', async () => {
        const testObj = newTestObj
        const {body} = await tokenRequest.post(`/updateTestObjectN/${testObj.id}`).send(testObj)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('deleteTestObjectN', async () => {
        const {body} = await tokenRequest.post(`/deleteTestObjectN/${testObj.id}`)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    afterAll(async () => {
        backendServer.close()
    })

    afterEach(async () => {
        const {body} = await tokenRequest.get('/getTestObjectNList')
        console.log(JSON.stringify(body, null, 2));
        expect(body.code).toBe(SUCCESS_CODE)
    })
});
