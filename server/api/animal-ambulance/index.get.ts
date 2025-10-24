import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const params = getQuery(event);
	const path = "/animal-ambulance";

	return await apiGet<IResponse>(path, event, params);
});
