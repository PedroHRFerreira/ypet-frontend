export const useAuthStore = defineStore("auth", () => {
	const isLoggedIn = ref(false);
	return {
		isLoggedIn,
	};
});
