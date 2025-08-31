export default defineEventHandler(async (event): Promise<IResponse> => {
	const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
	const animalsId = event.context.params?.id;
	const params = getQuery(event);
	const url = `${apiBaseUrl}/animals/${animalsId}`;

	const response = await $fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			"X-Client-Type": "web",
		},
		params,
	});

	return response as IResponse;
});
