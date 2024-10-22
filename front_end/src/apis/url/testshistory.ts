//router.get('/getHistory', HistoryController.getAllHistory)
// router.post('/addHistory', upload.single("file"), HistoryController.addHistory)
// router.post('/deleteHistory/:id', HistoryController.deleteHistory)
//router.get('/getHistoryById/:id', HistoryController.getHistoryById)

import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

export const HISTORY_API: UrlMap = {
    getHistory: {
        url: '/getHistory',
        method: Method.GET,
        format: ContentType.JSON
    },
    addHistory: {
        url: '/addHistory',
        method: Method.POST,
        format: ContentType.FORM_DATA
    },
    deleteHistory: {
        url: '/deleteHistory/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    getTargetHistoryFile:{
        url:'/getTargetHistoryFile',
        method:Method.GET,
        format:ContentType.JSON
    },
    getHistoryById:{
        url:'/getHistoryById/:id',
        method:Method.GET,
        format:ContentType.JSON
    }
}
