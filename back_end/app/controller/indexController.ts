import { Context } from "koa"

class IndexController {
    async index(ctx: Context) {
        console.log(111);

        ctx.body = "hello world"
    }
}

export default new IndexController
