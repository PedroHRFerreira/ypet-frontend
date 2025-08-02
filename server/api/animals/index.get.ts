export default defineEventHandler(async (event): Promise<IResponse> => {
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl;
  const url = `${apiBaseUrl}/animals`;
  const params = getQuery(event);

  const response = await $fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `${getCookie(event, "auth._token.laravelSanctum")}`,
      "X-Client-Type": "web",
    },
    params,
  });

  return response as IResponse;
});
