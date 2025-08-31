import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const id = event.context.params?.id;
	const params = getQuery(event);
	const path = `/users/${id}`;

	return await apiGet<IResponse>(path, event, params);
});
