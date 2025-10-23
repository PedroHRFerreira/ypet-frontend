/**
 * Composable para lidar com logout automático quando token expira
 */
export const useAutoLogout = () => {
	const authToken = useAuthToken();
	const router = useRouter();

	/**
	 * Desloga o usuário e redireciona para a página de login
	 */
	const performAutoLogout = async () => {
		// Remover tokens dos cookies
		authToken.removeTokenCookie();

		// Redirecionar para login
		if (import.meta.client) {
			// Usar window.location para garantir limpeza completa do estado
			window.location.href = "/login";
		} else {
			// No servidor, usar router
			await router.push("/login");
		}
	};

	/**
	 * Verifica se o erro é 401 e executa logout automático
	 */
	const handleUnauthorized = async (error: any) => {
		const status =
			error?.response?.status || error?.statusCode || error?.status;

		if (status === 401) {
			await performAutoLogout();
			return true;
		}

		return false;
	};

	return {
		performAutoLogout,
		handleUnauthorized,
	};
};
