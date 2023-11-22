import { createRequestHandler } from "@remix-run/express";
import { broadcastDevReady } from "@remix-run/node";
import express from "express";
import pkg from "http-proxy-middleware";
const { createProxyMiddleware, Filter, Options, RequestHandler } = pkg;
// notice that the result of `remix build` is "just a module"
import * as build from "./build/index.js";

const app = express();
app.use(express.static("public"));

// and your app is "just a request handler"
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://prometheus.tube",
    changeOrigin: true,
  })
);
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }
  console.log("App listening on http://localhost:3000");
});
