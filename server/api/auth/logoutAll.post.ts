export default defineEventHandler(async (event): Promise <IResponse> => {
  try {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
    const url = `${apiBaseUrl}auth/logout-all`;

    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `${getCookie(event, 'auth._token.laravelSanctum')}`,
        "X-Client-Type": "web",
      },
    });

    return  {
      status: "success",
      statusCode: 200,
      message: "Logout realizado com sucesso",
    } as IResponse;
  } catch (err) {
    const error = err as IError;

    return {
      status: "error",
      statusCode: error?.statusCode || 500,
      message: error?.message || "Erro ao realizar logout",
      data: err,
    } as IResponse;
  }
});