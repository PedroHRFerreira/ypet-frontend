export async function apiGet<T>(
	url: string,
	event: any,
	params?: Record<string, any>,
): Promise<T> {
	const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
	const fullUrl = `${apiBaseUrl}${url}`;
	const response = await $fetch(fullUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			"X-Client-Type": "web",
		},
		params,
	});

	return response as T;
}

export async function apiPost<T>(
	url: string,
	event: any,
	payload: Record<string, any>,
): Promise<T> {
	const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
	const fullUrl = `${apiBaseUrl}${url}`;
	const response = await $fetch(fullUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			"X-Client-Type": "web",
		},
		body: JSON.stringify(payload),
	});

	return response as T;
}

export async function apiPut<T>(
	url: string,
	event: any,
	payload: Record<string, any>,
): Promise<T> {
	const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
	const fullUrl = `${apiBaseUrl}${url}`;
	const response = await $fetch(fullUrl, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			"X-Client-Type": "web",
		},
		body: JSON.stringify(payload),
	});
	return response as T;
}

export async function apiPostForm<T>(
	url: string,
	event: any,
	params: URLSearchParams,
): Promise<T> {
	const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
	const fullUrl = `${apiBaseUrl}${url}`;
	const response = await $fetch(fullUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/json",
			Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			"X-Client-Type": "web",
		},
		body: params.toString(),
	});
	return response as T;
}
