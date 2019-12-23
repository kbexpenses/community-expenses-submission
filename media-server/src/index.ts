import Koa from "koa";

const app = new Koa();

app.use(async (ctx, next) => {
  // Ignore any requests which are not POST
  if (ctx.method !== "POST") {
    return await next();
  }
});

app.use(async (ctx, next) => {
  ctx.body = "Hello";
});

app.listen(4000);

console.log("Started koa on 4000 #GjsIbU");
