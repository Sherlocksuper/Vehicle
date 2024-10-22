import {request} from "@/utils/request.ts";
import {HISTORY_API} from "@/apis/url/testshistory.ts";

interface AddHistory {
    fatherConfigName: string,
    file: File
}

export const addTestsHistory = (data: AddHistory) => {
    const api = HISTORY_API.addHistory
    return request({
        api: api,
        params: data
    })
}

export const deleteTestsHistory = (id: number) => {
    const api = {...HISTORY_API.deleteHistory}
    api.url = api.url.replace(':id', id.toString())
    return request({
        api: api
    })
}

export const getTestsHistory = () => {
    const api = HISTORY_API.getHistory
    return request({
        api: api
    })
}

export const getTargetHistoryFile = (id: number) => {
    const api = {...HISTORY_API.getTargetHistoryFile}
    api.url = api.url.replace(':id', id.toString())
    return request({
        api: api
    })
}

export const getTestsHistoryById = (id: number) => {
    const api = {...HISTORY_API.getHistoryById}
    api.url = api.url.replace(':id', id.toString())
    return request({
        api: api
    })
}
