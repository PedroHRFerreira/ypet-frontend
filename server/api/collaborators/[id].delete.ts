import { apiDelete } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const id = event.context.params?.id;
	const params = getQuery(event);
	const path = `/collaborators/${id}`;

	return await apiDelete<IResponse>(path, event, params);
});
