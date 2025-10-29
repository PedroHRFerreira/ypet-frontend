import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { IPasswordChange } from "~/types/password";
import { useUserProfile } from "~/composables/useUserProfile";

export const useSettingsStore = defineStore("settings", () => {
	const user = ref<IUser | null>(null);
	const isLoading = ref(false);
	const isLoadingPassword = ref(false);

	const passwordForm = ref<IPasswordChange>({
		current_password: "",
		new_password: "",
		confirm_password: "",
	});

	const passwordErrors = ref({
		current_password: [] as string[],
		new_password: [] as string[],
		confirm_password: [] as string[],
	});

	const userName = computed(() => user.value?.name || "");
	const userEmail = computed(() => user.value?.email || "");
	const hasPasswordErrors = computed(() =>
		Object.values(passwordErrors.value).some((arr) => arr.length > 0),
	);

	function fetchUserData(): void {
		if (isLoading.value) {
			return;
		}

		isLoading.value = true;
		try {
			const userProfile = useUserProfile();
			const userData = userProfile.getUser();

			if (userData) {
				user.value = userData;
			}
		} catch (error) {
			console.error("Erro ao buscar dados do usuário:", error);
		} finally {
			isLoading.value = false;
		}
	}

	function validateCurrentPassword(): boolean {
		passwordErrors.value.current_password = [];

		if (!passwordForm.value.current_password.trim()) {
			passwordErrors.value.current_password = ["Senha atual obrigatória"];
			return false;
		}

		return true;
	}

	function validateNewPassword(): boolean {
		passwordErrors.value.new_password = [];

		if (!passwordForm.value.new_password.trim()) {
			passwordErrors.value.new_password = ["Nova senha obrigatória"];
			return false;
		}

		if (passwordForm.value.new_password.length < 8) {
			passwordErrors.value.new_password = [
				"A senha deve ter no mínimo 8 caracteres",
			];
			return false;
		}

		return true;
	}

	function validateConfirmPassword(): boolean {
		passwordErrors.value.confirm_password = [];

		if (!passwordForm.value.confirm_password.trim()) {
			passwordErrors.value.confirm_password = [
				"Confirmação de senha obrigatória",
			];
			return false;
		}

		if (
			passwordForm.value.confirm_password !== passwordForm.value.new_password
		) {
			passwordErrors.value.confirm_password = ["As senhas não coincidem"];
			return false;
		}

		return true;
	}

	function validatePasswordForm(): boolean {
		const isCurrentValid = validateCurrentPassword();
		const isNewValid = validateNewPassword();
		const isConfirmValid = validateConfirmPassword();

		return isCurrentValid && isNewValid && isConfirmValid;
	}

	async function updatePassword(): Promise<boolean> {
		if (!validatePasswordForm()) {
			return false;
		}

		isLoadingPassword.value = true;
		try {
			const response = (await $fetch("/api/auth/me/password", {
				method: "PUT" as any,
				body: {
					current_password: passwordForm.value.current_password,
					new_password: passwordForm.value.new_password,
					new_password_confirmation: passwordForm.value.confirm_password,
				},
			})) as IResponse;

			if (response.type === "success") {
				clearPasswordForm();
				return true;
			}

			if (response.status === 422 && response.errors) {
				if (response.errors.current_password) {
					passwordErrors.value.current_password =
						response.errors.current_password;
				}
				if (response.errors.new_password) {
					passwordErrors.value.new_password = response.errors.new_password;
				}
				if (response.errors.new_password_confirmation) {
					passwordErrors.value.confirm_password =
						response.errors.new_password_confirmation;
				}
				return false;
			}

			if (response.status === 401) {
				passwordErrors.value.current_password = ["Senha atual incorreta"];
				return false;
			}

			return false;
		} catch (error) {
			console.error("Erro ao alterar senha:", error);
			return false;
		} finally {
			isLoadingPassword.value = false;
		}
	}

	function clearPasswordForm(): void {
		passwordForm.value.current_password = "";
		passwordForm.value.new_password = "";
		passwordForm.value.confirm_password = "";
		clearPasswordErrors();
	}

	function clearPasswordErrors(): void {
		passwordErrors.value.current_password = [];
		passwordErrors.value.new_password = [];
		passwordErrors.value.confirm_password = [];
	}

	function setPasswordField(field: keyof IPasswordChange, value: string): void {
		passwordForm.value[field] = value;
		passwordErrors.value[field] = [];
	}

	return {
		user,
		isLoading,
		isLoadingPassword,
		passwordForm,
		passwordErrors,
		userName,
		userEmail,
		hasPasswordErrors,
		fetchUserData,
		updatePassword,
		validatePasswordForm,
		clearPasswordForm,
		clearPasswordErrors,
		setPasswordField,
	};
});
