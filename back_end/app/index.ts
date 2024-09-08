import Koa from 'koa'
import router from './router'
import {Server} from 'http'
import DB from '../app/db'
import fileServer from 'koa-static'
import path from 'node:path'
import koaBodyParser from 'koa-bodyparser'
import bodyparser from 'koa-body'
import serve from "koa-static";
import {createConnectionToLong} from "./ztcp/sender";


const app = new Koa

app.use(fileServer(path.join(__dirname, 'assets')))
app.use(bodyparser({
    multipart: true,
}))
app.use(router.routes())
app.use(serve(path.join(__dirname, '../public')));

createConnectionToLong()

const run = async (port: string): Promise<Server> => {
    await DB.connectDB()
    await DB.initDB()
    return app.listen(port, () => {
        console.log(`http://localhost:${port}`);
    })
}


export default run
