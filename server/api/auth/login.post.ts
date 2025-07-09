export default defineEventHandler(async (event): Promise <IResponse> => {
    try {
      const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
      const url = `${apiBaseUrl}/auth/login`;
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

      return  {
        status: "success",
        statusCode: 200,
        message: "Login realizado com sucesso",
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
        message: error.message || "Erro ao realizar login",
        data: error,
      } as IResponse;
    }
});