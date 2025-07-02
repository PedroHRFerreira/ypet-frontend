import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineNuxtRouteMiddleware(() => {
	const auth = useAuthLoginStore();

	if (auth.isLoggedIn === false) {
		return navigateTo("/login", { replace: true });
	}
});
