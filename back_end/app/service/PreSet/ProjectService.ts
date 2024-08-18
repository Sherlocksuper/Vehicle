import Project, {IProjectModel} from "../../model/PreSet/3Project.model";

class ProjectService {
    async getProjectList() {
        return await Project.findAll();
    }

    async getProjectById(id: number) {
        return await Project
            .findOne({
                where: {
                    id
                }
            });
    }

    async createProject(project: IProjectModel) {
        return await Project.create(project);
    }

    async updateProject(id: number, projectName: string) {
        const project = await Project.findByPk(id);
        if (project) {
            project.projectName = projectName;
            await project.save();
            return project;
        }
        return null;
    }

    async deleteProject(id: number) {
        const project = await Project.findByPk(id);
        if (project) {
            await project.destroy();
            return project.id;
        }
        return 0;
    }


    // 初始化项目
    async initProject(num: number) {
        for (let i = 0; i < num; i++) {
            const name = `测试项目${i}`
            const project = await Project.findOne({
                where: {
                    projectName: name
                }
            });
            if (!project) {
                await Project.create({
                    projectName: name,
                    projectConfig: [
                        {
                            "signal": {
                                "id": 1,
                                "remark": "测试信号备注",
                                "innerIndex": 1,
                                "signalName": "行驶速度",
                                "signalType": "测试信号类型0",
                                "signalAttribute": "测试信号属性0",
                                "signalUnit": "测试信号单位0",
                                "collectorId": 1
                            },
                            "collector": {
                                "isDisabled": false,
                                "id": 1,
                                "collectorName": "zx-04A-1",
                                "collectorAddress": "1",
                                "userId": null
                            },
                            "controller": {
                                "isDisabled": false,
                                "id": 1,
                                "controllerName": "hx-04A-1",
                                "controllerAddress": "192.168.0.101",
                                "userId": null
                            },
                        }
                    ]
                });
            }
        }
    }
}

export default new ProjectService()
