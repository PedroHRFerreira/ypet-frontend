import { useAuthStore } from "~/stores/useAuthStore";

export default defineNuxtRouteMiddleware(() => {
	const auth = useAuthStore();

	if (auth.isLoggedIn === true) {
		return navigateTo("/", { replace: true });
	}
});
