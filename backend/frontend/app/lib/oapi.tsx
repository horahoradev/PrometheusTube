import * as api from "packages/promtube-backend";

export function useApi(): api.DefaultApi {
	const configParams = {
		baseServer: api.servers[0],
	};
	const config = api.createConfiguration(configParams);

	return new api.DefaultApi(config);
}
