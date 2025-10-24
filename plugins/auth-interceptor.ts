/**
 * Plugin para interceptar erros 401 (Unauthorized) e deslogar usuário automaticamente
 * quando o token expira ou se torna inválido
 */
export default defineNuxtPlugin((nuxtApp) => {
	const authToken = useAuthToken();
	const performLogout = () => {
		authToken.removeTokenCookie();

		if (import.meta.client) {
			window.location.href = "/login";
		}
	};

	const checkAndLogout = (error: any) => {
		const status =
			error?.response?.status || error?.statusCode || error?.status;

		if (status === 401) {
			performLogout();
			return true;
		}

		return false;
	};

	nuxtApp.hook("vue:error", (error: any) => {
		checkAndLogout(error);
	});
	if (import.meta.client) {
		const originalFetch = window.fetch;

		window.fetch = async (...args) => {
			const response = await originalFetch(...args);

			if (response.status === 401) {
				performLogout();
			}

			return response;
		};
	}
});
