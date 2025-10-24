import { defineEventHandler, getQuery } from "h3";
import { apiGet } from "~/utils/api";

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;

  try {
    const response = await apiGet("/applications", event, query);
    return response;
  } catch (error: any) {
    const status = error?.status || 500;
    const message = error?.data?.message || "Erro ao buscar aplicações.";
    event.node.res.statusCode = status;
    return { message };
  }
});