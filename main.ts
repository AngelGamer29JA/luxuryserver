import { Application, Router, send } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { join } from "https://deno.land/std@0.220.1/path/mod.ts";

const app = new Application({ logErrors: false });
const router = new Router();
const clients: WebSocket[] = [];

const PORT = 8000;

router.get("/wss", (ctx) => {
    if (!ctx.isUpgradable) {
        ctx.throw(501);
    }
    const ws = ctx.upgrade();

    ws.onopen = () => {
        console.log("New client connected");
        clients.push(ws);
    }

    ws.onmessage = (data) => {
        console.log(data.data.toString())
        broadcast(data.data, ws)
    }

    ws.onclose = () => {
        clients.splice(clients.indexOf(ws), 1);
    }

});

function broadcast(message: string, sender: WebSocket) {
    for (const client of clients) {
        if (sender !== client) client.send(message)
    }
}

console.log("Server listen at %s", PORT)
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    try {
        let pathname = ctx.request.url.pathname;
        if (pathname === "/controller") {
            pathname = "/"
        }
        const filePath = join(Deno.cwd(), "dist");
        await send(ctx, pathname, {
            root: filePath,
            index: "index.html"
        });
    } catch (e) {
        console.log(e)
    }
});


app.listen({ port: PORT });