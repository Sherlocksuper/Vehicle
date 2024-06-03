//export const PROJECT_API: UrlMap = {
//     getProjectList: {
//         url: '/getProjectList',
//         method: Method.GET,
//         format: ContentType.JSON
//     },
//     createProject: {
//         url: '/createProject',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     updateProject: {
//         url: '/updateProject/:id',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     getProjectById: {
//         url: '/getProjectById/:id',
//         method: Method.GET,
//         format: ContentType.JSON
//     },
//     deleteProject: {
//         url: '/deleteProject/:id',
//         method: Method.POST,
//         format: ContentType.JSON
//     }
// }

//增删改查
/**
 * 获取项目列表
 */
import {request} from "@/utils/request.ts";
import {PROJECT_API} from "@/apis/url/project.ts";
import {IProject} from "@/apis/standard/project.ts";

export const getProjects = async () => {
    const api = PROJECT_API.getProjectList;
    return request({
        api: api
    });
}

/**
 * 创建项目
 * @param iProject
 */
export const createProject = async (iProject: IProject) => {
    const api = PROJECT_API.createProject;
    return request({
        api: api,
        params: iProject
    });

}

/**
 * 更新项目
 * @param id
 * @param iProject
 */
export const updateProject = async (id: number, iProject: IProject) => {
    const api = PROJECT_API.updateProject;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: iProject
    });
}

/**
 * 获取项目详情
 * @param id
 */
export const getProjectById = async (id: number) => {
    const api = PROJECT_API.getProjectById;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: {id: id}
    });
}

/**
 * 删除项目
 * @param id
 */
export const deleteProject = async (id: number) => {
    const api = PROJECT_API.deleteProject;
    api.url = api.url.replace(':id', id.toString());
    return request({
        api: api,
        params: {id: id}
    });
}