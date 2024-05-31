import {SEARCH_SUCCESS_MSG, SUCCESS_CODE, TestTemplateType} from "../app/constants";
import request, {Agent} from "supertest";
import run from "../app";
import BE_CONFIG from "../app/config/be_config";
import OT_CONFIG from "../app/config/ot_config";
import {Server} from "http";
import {ITestTemplate} from "../app/model/TestTemplate.model";


describe('测试模板', () => {
    let testTemplateData: ITestTemplate;
    let backendServer: Server
    let tokenRequest: Agent

    beforeAll(async () => {
        testTemplateData = {
            id: 1,
            name: "Test Template 1",
            description: "This is a test template",
            createTime: "2022-01-01T00:00:00Z",
            updateTime: "2022-01-01T00:00:00Z",
            itemConfig: [
                {
                    type: TestTemplateType.NUMBER,
                    requestSignalId: 1,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    title: "Title 1",
                    interval: 10,
                    trueLabel: "True",
                    falseLabel: "False",
                    unit: "Unit",
                    during: 10,
                    min: 0,
                    max: 100,
                    label: "Label 1"
                }
            ]
        };

        backendServer = await run(BE_CONFIG.BE_PORT!)
        // 登录root账户
        const {body: {data: {token}}} = await request(backendServer).post('/login').send({
            username: OT_CONFIG.TEST_ROOT_USERNAME,
            password: OT_CONFIG.TEST_ROOT_PASSWORD
        })

        tokenRequest = request.agent(backendServer).set('Authorization', token)
    });

    it('should create a new TestTemplate', async () => {
        const {status, body: {msg}} = await request(backendServer)
            .post('/createTestTemplate')
            .send(testTemplateData);
        expect(status).toBe(200);
    });

    it('should get a TestTemplate by id', async () => {
        const {status} = await request(backendServer)
            .get(`/getTestTemplateById/${testTemplateData.id}`);
        expect(status).toBe(200);
    });

    it('should update a TestTemplate', async () => {
        const {status} = await request(backendServer)
            .put(`/updateTestTemplate/${testTemplateData.id}`)
            .send({name: 'Updated Test Template'});
        expect(status).toBe(200);
    });

    it('should delete a TestTemplate', async () => {
        const {status} = await request(backendServer)
            .delete(`/deleteTestTemplate/${testTemplateData.id}`);
        expect(status).toBe(200);
    });

    it('should get a list of TestTemplates', async () => {
        const {status} = await request(backendServer).get('/getTestTemplateList');
        expect(status).toBe(200);
    });

    afterEach(async () => {
        const {status, body: {msg, data}} = await tokenRequest.get('/getTestTemplateList')
        console.log(data)
        expect(status).toBe(200)
    });
})