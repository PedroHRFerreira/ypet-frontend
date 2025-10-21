import { apiPut } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
	try {
		const id = event.context.params?.id;
		const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
		const url = `${apiBaseUrl}/animals/${id}`;
		const formData = await readFormData(event);

		const response = await $fetch(url, {
			method: "PUT",
			headers: {
			  Accept: "application/json",
			  "X-Client-Type": "web",
			  Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
			},
			body: formData,
		  });
	  
		  return {
			status: "success",
			statusCode: 200,
			message: "Atualizado com sucesso",
			data: response,
		  } as IResponse;
	} catch (err) {
		const error = err as IError;

		if (error?.statusCode === 422) {
			return error.data as IResponse;
		}

		return {
			type: "error",
			show: true,
			status: error?.statusCode || 500,
			message: error.message || "Erro ao atualizar animal",
			data: error,
		} as IResponse;
	}
});
