import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const params = getQuery(event);
	const path = "/products";

	return await apiGet<IResponse>(path, event, params);
});