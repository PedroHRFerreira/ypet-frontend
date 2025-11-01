import { apiDelete } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	const id = event.context.params?.id;
	const params = getQuery(event);
	const path = `/clinic-events/${id}`;

	return await apiDelete<IResponse>(path, event, params);
});
