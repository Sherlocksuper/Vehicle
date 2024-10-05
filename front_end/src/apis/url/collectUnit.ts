import {UrlMap} from "@/apis/url/myUrl.ts";
import {ContentType, Method} from "@/apis/standard/all.ts";

//router.post('/addCollectUnit', CollectUnitController.addCollectUnit);
// router.post('/deleteCollectUnit/:id', CollectUnitController.deleteCollectUnit);
// router.post('/updateCollectUnit', CollectUnitController.updateCollectUnit);
// router.get('/getCollectUnits', CollectUnitController.getCollectUnits);
export const COLLECT_UNIT_API: UrlMap = {
    addCollectUnit: {
        url: '/addCollectUnit',
        method: Method.POST,
        format: ContentType.JSON
    },
    deleteCollectUnit: {
        url: '/deleteCollectUnit/:id',
        method: Method.POST,
        format: ContentType.JSON
    },
    updateCollectUnit: {
        url: '/updateCollectUnit',
        method: Method.POST,
        format: ContentType.JSON
    },
    getCollectUnits: {
        url: '/getCollectUnits',
        method: Method.GET,
        format: ContentType.JSON
    }
}
