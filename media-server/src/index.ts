import fs from "fs-extra";
import path from "path";
import Koa from "koa";
import body from "koa-body";
import jwt from "koa-jwt";
import cors from "@koa/cors";
import { koaJwtSecret } from "jwks-rsa";
import uuid from "uuid/v4";
import send from "koa-send";

const MEDIA_PATH = "./data/";

const app = new Koa();

app.use(cors());

app.use(
  jwt({
    secret: koaJwtSecret({
      jwksUri:
        "https://community-expenses-dev.eu.auth0.com/.well-known/jwks.json",
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 24 * 60 * 60 * 1e3
    }),
    audience: "mZeX1QFQKvmzwjZKYRcvmzYsO8d1Ygox",
    issuer: "https://community-expenses-dev.eu.auth0.com/"
  })
);

app.use(body({ multipart: true }));

app.use(async (ctx, next) => {
  // Ignore any requests which are not POST
  if (ctx.method !== "POST") {
    return await next();
  }

  const userId = ctx.state.user.sub;
  const roles =
    ctx.state.user["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"];

  // If we do not have exactly 1 file, return 500
  if (!ctx.request.files || !ctx.request.files.file) {
    console.log("No files #mgCb2N", ctx.request.files, ctx.request);
    ctx.throw(500, "Failed to upload a file #WkdnEy");
  }

  const fileId = uuid();
  const newFileName = `${userId}__${fileId}`;
  const file = ctx.request.files.file;
  const reader = fs.createReadStream(file.path);
  const writer = fs.createWriteStream(path.join(MEDIA_PATH, newFileName));
  reader.pipe(writer);

  ctx.body = JSON.stringify({ fileUrl: `/${userId}/${fileId}` });
});

app.use(async (ctx, next) => {
  const [_, userId, fileName] = ctx.path.split("/");

  if (!userId || !fileName) {
    console.log("Not found #j2o4dm", ctx.path);
    ctx.throw(404, "Not found #E56ubM");
  }

  // Build the filename
  const filePath = path.join(MEDIA_PATH, `${userId}__${fileName}`);
  console.log("Sending filePath #RGm8Me", filePath);
  await send(ctx, filePath);
  console.log("File sent #RDz9XD");

  // ctx.body = "Hello";
});

app.listen(4000);

console.log("Started koa on 4000 #GjsIbU");
