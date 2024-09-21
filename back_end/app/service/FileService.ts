import * as fs from "fs";
import path from "node:path";

export default class FileService {

    async storeFile(filePath: string, originName: string) {
        try {
            const date = new Date().toISOString().slice(0, 10);
            const dirPath = path.join(__dirname, `../../public/uploads/${date}`);
            const time = new Date().toISOString().slice(11, 19).replace(/:/g, '');
            const destPath = path.join(dirPath, `../../../public/uploads/${date}/${time + originName}`);
            fs.mkdirSync(dirPath, {recursive: true});

            const reader = fs.createReadStream(filePath)
            const upStream = fs.createWriteStream(destPath)
            reader.pipe(upStream)

            return destPath
        } catch (e) {
            console.log(e)
            return ""
        }
    }



}
