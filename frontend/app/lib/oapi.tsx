import { ServerConfiguration } from "node_modules/promtube-backend";
import * as api from "packages/promtube-backend";

export function useApi(SSR = false, nginx: string | undefined): api.DefaultApi {
  let server = new ServerConfiguration("/api", {}); // clientside by default, only context in which we can use relative URLs because we need access to the browser's window API
  if (SSR) {
    if (nginx !== undefined) {
      // if we're accessing this from docker, it needs to go to the nginx container
      server = server = new ServerConfiguration("http://nginx/api", {});
    } else {
      // we're running it locally and proxying to the right place
      server = server = new ServerConfiguration(
        "http://localhost:3000/api",
        {}
      );
    }
  }
  const configParams = {
    baseServer: server,
  };
  const config = api.createConfiguration(configParams);

  return new api.DefaultApi(config);
}
