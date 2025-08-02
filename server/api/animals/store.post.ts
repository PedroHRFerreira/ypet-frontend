export default defineEventHandler(async (event): Promise<IResponse> => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
    const url = `${apiBaseUrl}/animals`;
    const body = await readBody(event);

    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Client-Type": "web",
      },
      body,
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
