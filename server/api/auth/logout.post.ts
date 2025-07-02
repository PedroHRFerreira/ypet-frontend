export default defineEventHandler(async (event): Promise <IResponse> => {
  try {
    const url = "http://localhost:8000/api/logout";

    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `${getCookie(event, 'auth._token.laravelSanctum')}`,
      },
    });

    return  {
      status: "success",
      statusCode: 200,
      message: "Logout realizado com sucesso",
    } as IResponse;
  } catch (err) {
    return {
      status: "error",
      statusCode: err?.statusCode || 500,
      message: "Erro ao realizar logout",
      data: err,
    } as IResponse;
  }
});