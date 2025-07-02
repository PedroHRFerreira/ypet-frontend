export default defineEventHandler(async (event): Promise <IResponse> => {
  try {
    const url = "http://localhost:8000/api/register";
    const body = await readBody(event);

    const response = await $fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });

    return  {
      status: "success",
      statusCode: 200,
      message: "Cadastro realizado com sucesso",
      data: response
    } as IResponse;
  } catch (err) {
    const error = err as IError;

    if (error?.statusCode === 422) {
      return {
        status: "error",
        statusCode: error.statusCode,
        message: error.message || "Dados inválidos",
        data: error.data,
      } as IResponse;
    }

    return {
      status: "error",
      statusCode: error?.statusCode || 500,
      message: error.message || "Erro ao realizar cadastro",
      data: error,
    } as IResponse;
  }
});