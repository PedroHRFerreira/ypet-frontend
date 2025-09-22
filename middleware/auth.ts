import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineNuxtRouteMiddleware(() => {
	const auth = useAuthLoginStore();

	if (!auth.isLoggedIn()) {
		console.log("TWEAK PARA ACESSAR DASHBOARD SEM LOGIN FEITO");
	}
});
