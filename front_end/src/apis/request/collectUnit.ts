//export const COLLECT_UNIT_API: UrlMap = {
//     addCollectUnit: {
//         url: '/addCollectUnit',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     deleteCollectUnit: {
//         url: '/deleteCollectUnit/:id',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     updateCollectUnit: {
//         url: '/updateCollectUnit',
//         method: Method.POST,
//         format: ContentType.JSON
//     },
//     getCollectUnits: {
//         url: '/getCollectUnits',
//         method: Method.GET,
//         format: ContentType.JSON
//     }
// }


import {PROJECT_API} from "@/apis/url/project.ts";
import {request} from "@/utils/request.ts";
import {ICollectUnit} from "@/apis/standard/collectUnit.ts";
import {COLLECT_UNIT_API} from "@/apis/url/collectUnit.ts";

export const getProjects = async () => {
  const api = PROJECT_API.getProjectList;
  return request({
    api: api
  });
}

// /**
//  * 创建项目
//  * @param iProject
//  */
// export const createProject = async (iProject: IProject) => {
//   const api = PROJECT_API.createProject;
//   return request({
//     api: api,
//     params: iProject
//   });
//
// }

export const createCollectUnit = async (iCollectUnit:ICollectUnit) => {
  const api = COLLECT_UNIT_API.addCollectUnit;
  return request({
    api: api,
    params: iCollectUnit
  });
}

export const getCollectUnits = async () => {
  const api = COLLECT_UNIT_API.getCollectUnits;
  return request({
    api: api
  });
}

export const deleteCollectUnit = async (id: number) => {
  const api = {...COLLECT_UNIT_API.deleteCollectUnit};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: {id: id}
  });
}

export const updateCollectUnit = async (id: number, iCollectUnit: ICollectUnit) => {
  const api = {...COLLECT_UNIT_API.updateCollectUnit};
  api.url = api.url.replace(':id', id.toString());
  return request({
    api: api,
    params: iCollectUnit
  });
}
