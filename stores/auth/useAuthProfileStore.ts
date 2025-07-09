export const useAuthProfileStore = defineStore("authRegister", {
	state: () => {
		const profile = ref({} as IUser);
		const isLoading = ref(false);

		return {
			isLoading,
			profile,
		};
	},
	actions: {
		setProfile(profile: IUser) {
			this.$state.profile = profile;
		},
		async fetchProfile(): Promise<void> {
			if (this.isLoading) {
				return;
			}

			const { data } = await useFetch("/api/auth/profile", {
				method: "GET",
			});

			const response: IResponse = data.value as IResponse;

			if (response.status === "success") {
				const user: IUser = response.data as IUser;
				this.setProfile(user);
			}
		},
	},
});
