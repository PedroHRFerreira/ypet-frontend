import { IResponse, IError } from "~/types";

export default defineEventHandler(async (event): Promise<IResponse> => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
    const url = `${apiBaseUrl}/animals`;
    const formData = await readFormData(event);

    const response = await $fetch(url, {
      method: "POST",
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
      message: "Cadastro realizado com sucesso",
      data: response,
    } as IResponse;
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
