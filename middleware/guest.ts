import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineNuxtRouteMiddleware(() => {
	const auth = useAuthLoginStore();

	if (auth.isLoggedIn === true) {
		return navigateTo("/", { replace: true });
	}
});
