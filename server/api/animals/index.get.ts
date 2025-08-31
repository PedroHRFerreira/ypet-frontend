import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const params = getQuery(event);

	return await apiGet<IResponse>("/animals", event, params);
});
