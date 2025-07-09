export default defineEventHandler(async (event): Promise <IResponse> => {
    const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
    const url = `${apiBaseUrl}/auth/me`;
    const body = await readBody(event);

    const response = await $fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `${getCookie(event, 'auth._token.laravelSanctum')}`,
        "X-Client-Type": "web",
      },
      body,
    });

    return  {
      status: "success",
      statusCode: 200,
      message: "Perfil carregado com sucesso",
      data: response
    } as IResponse;
});