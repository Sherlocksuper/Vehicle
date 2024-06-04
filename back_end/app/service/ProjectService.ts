import Project, {IProjectModel} from "../model/3Project.model";
import {IControllerModel} from "../model/Controller.model";
import {ICollectorModel} from "../model/Collector.model";
import {ISignalModel} from "../model/Signal.model";


export default class ProjectService {
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
}