import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware(() => {
	const auth = useAuthStore();

	if (auth.isLoggedIn === false) {
		return navigateTo("/login", { replace: true });
	}
});
