import TestTemplateModel, {ITemplate} from '../../model/PreSet/TestTemplate.model';

class TestTemplateService {
    // 创建一个新的TestTemplate
    async create(testTemplateData: ITemplate) {
        try {
            const testTemplate = await TestTemplateModel.create(testTemplateData);
            return testTemplate;
        } catch (error) {
            throw error;
        }
    }

    // 读取一个TestTemplate
    async read(id: string) {
        try {
            const testTemplate = await TestTemplateModel.findByPk(id);
            return testTemplate;
        } catch (error) {
            throw error;
        }
    }

    // 有则更新，无则添加
    async update(id: string, updateData: ITemplate) {
        try {
            const testTemplate = await TestTemplateModel.findByPk(id);
            if (testTemplate) {
                await testTemplate.update(updateData);
                return testTemplate;
            }
            const newTestTemplate = await TestTemplateModel.create(updateData);
            return newTestTemplate;
        } catch (error) {
            throw error;
        }
    }

    // 删除一个TestTemplate
    async delete(id: string) {
        try {
            const testTemplate = await TestTemplateModel.findByPk(id);
            if (testTemplate) {
                await testTemplate.destroy();
                return true;
            }
            throw new Error('TestTemplate not found');
        } catch (error) {
            throw error;
        }
    }

    async getTestTemplateList() {
        try {
            const testTemplateList = await TestTemplateModel.findAll();
            return testTemplateList;
        } catch (error) {
            throw error;
        }
    }
}

export default new TestTemplateService();
