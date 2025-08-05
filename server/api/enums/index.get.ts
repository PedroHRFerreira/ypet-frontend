export default defineEventHandler(async (event): Promise<IResponse> => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
  const params = getQuery(event);
  const group = params.group || "";
  console.log('group', group);
  if (!group) {
    throw createError({
      statusCode: 400,
      statusMessage: "Parâmetro 'group' é obrigatório.",
    });
  }
  const url = `${apiBaseUrl}/enums/${group}`;

  const response = await $fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
      "X-Client-Type": "web",
    },
  });

  return response as IResponse;
});
