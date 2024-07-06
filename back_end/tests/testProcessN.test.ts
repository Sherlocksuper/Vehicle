import {ITestProcessNModel} from "../app/model/1TestProcessN";
import {ITestObjectNModel} from "../app/model/2TestObjectN.model";
import {Server} from "http";
import request, {Agent} from "supertest";
import run from "../app";
import BE_CONFIG from "../app/config/be_config";
import OT_CONFIG from "../app/config/ot_config";
import {SUCCESS_CODE} from "../app/constants";

describe('Test processN', () => {
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

    const testProcessN: ITestProcessNModel = {
        id: 1,
        userId: 1,
        testName: 'testName',
        testObjectNs: [
            testObj
        ]
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

    ///**
    //  * 测试流程管理接口 TestProcessN
    //  * created by lby on 6.5
    //  */
    // router.get('/getTestProcessNList', TestProcessNController.getAllTestProcessNs)
    // router.post('/createTestProcessN', TestProcessNController.createTestProcessN)
    // router.get('/getTestProcessNById/:id', TestProcessNController.getTestProcessN)
    // router.post('/updateTestProcessN/:id', TestProcessNController.updateTestProcessN)
    // router.post('/deleteTestProcessN/:id', TestProcessNController.deleteTestProcessN)

    it('createTestProcessN', async () => {
        const {body} = await tokenRequest.post('/createTestProcessN').send(testProcessN)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('getTestProcessNList', async () => {
        const {body} = await tokenRequest.get('/getTestProcessNList')
        expect(body.code).toBe(SUCCESS_CODE)
    })


    it('getTestProcessNById', async () => {
        console.log(testProcessN.id)
        const {body} = await tokenRequest.get(`/getTestProcessNById/${testProcessN.id}`)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('updateTestProcessN', async () => {
        const {body} = await tokenRequest.post(`/updateTestProcessN/${testProcessN.id}`).send(testProcessN)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    it('deleteTestProcessN', async () => {
        console.log("delete")
        const {body} = await tokenRequest.post(`/deleteTestProcessN/${testProcessN.id}`)
        expect(body.code).toBe(SUCCESS_CODE)
    })

    afterEach(() => {
        tokenRequest.get('/getTestProcessNList').then((res) => {
            console.log(res.body)
        })
    })
});
