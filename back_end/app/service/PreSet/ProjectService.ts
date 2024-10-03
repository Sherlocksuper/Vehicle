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
        }
    }
}

export default new ProjectService()
