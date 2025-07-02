export default defineEventHandler(async (event): Promise <IResponse> => {
    try {
      const url = "http://localhost:8000/api/login";
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
        message: "Login realizado com sucesso",
        data: response
      } as IResponse;
    } catch (err) {
      if (err?.statusCode === 422) {
        return {
          status: "error",
          statusCode: err.statusCode,
          message: "Dados inválidos",
          data: err.data,
        } as IResponse;
      }

      return {
        status: "error",
        statusCode: err?.statusCode || 500,
        message: "Erro ao realizar login",
        data: err,
      } as IResponse;
    }
});