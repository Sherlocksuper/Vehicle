import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

///**
//  * 项目管理接口
//  * created by lby on 6.2
//  */
// router.get('/getProjectList', ProjectController.getProjectList)
// router.post('/createProject', ProjectController.createProject)
// router.post('/updateProject/:id', ProjectController.updateProject)
// router.get('/getProjectById/:id', ProjectController.getProjectById)
// router.post('/deleteProject/:id', ProjectController.deleteProject)


export const PROJECT_API: UrlMap = {
    getProjectList: {
        url: '/getProjectList',
        method: Method.GET,
        format: ContentType.JSON
    },
    createProject: {
        url: '/createProject',
        method: Method.POST,
        format: ContentType.JSON
    },
    updateProject: {
        url: '/updateProject/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    getProjectById: {
        url: '/getProjectById/:id',
        method: Method.GET,
        format: ContentType.JSON
    },
    deleteProject: {
        url: '/deleteProject/:id',
        method: Method.POST,
        format: ContentType.JSON
    }
}
