import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const params = getQuery(event);
	const path = "/suppliers";

	return await apiGet<IResponse>(path, event, params);
});
