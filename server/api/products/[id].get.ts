import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event): Promise<IResponse> => {
  try {
    const id = event.context.params?.id;
    const params = getQuery(event);
    const path = `/products/${id}`;

    return await apiGet<IResponse>(path, event, params);
  } catch (err) {
    const error = err as IError;

    return {
      type: "error",
      status: error?.statusCode || 500,
      message: error.message || "Erro ao buscar produto",
      data: error,
    } as IResponse;
  }
});