import * as fs from "fs";
import path from "node:path";

export default class FileService {

    async storeFile(filePath: string, originName: string) {
        try {
            console.log(filePath)
            const date = new Date().toISOString().slice(0, 10);
            const dirPath = path.join(__dirname, `../../public/uploads/${date}`);
            const destPath = path.join(dirPath, `../../../public/uploads/${date}/${originName}`);
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