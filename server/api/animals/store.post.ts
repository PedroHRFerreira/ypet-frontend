export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/animals`;
    const formData = await readFormData(event);


    const payload: Record<string, any> = {};

    formData.forEach((value, key) => {
      payload[key] = value;
    });

		const response = await $fetch(url, {
			method: "POST",
      onRequest: ({options}) => {
        options.headers.set("Authorization", `${getCookie(event, "auth._token.laravelSanctum")}`);
        options.headers.set("X-Client-Type", "web");
      },
      body: JSON.stringify(payload)
		});

		return response as IResponse;
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			status: error?.statusCode || 500,
			message: error.message || "Erro ao armazenar animal",
			data: error,
		} as IResponse;
	}
});
