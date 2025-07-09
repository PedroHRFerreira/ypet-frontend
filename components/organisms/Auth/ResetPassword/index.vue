<script lang="ts">
import { defineComponent } from "vue";
import { useAuthResetPasswordStore } from "~/stores/auth/useAuthResetPasswordStore";

export default defineComponent({
	name: "OrganismsAuthResetPassword",
	setup() {
		const useAuthResetPassword = useAuthResetPasswordStore();
		const useAuthLogin = useAuthResetPasswordStore();

		return {
			useAuthResetPassword,
			useAuthLogin,
		};
	},
	methods: {
		handleResetPassword() {
			this.useAuthResetPassword.resetPassword().then((res: boolean) => {
				if (res) {
					const email = this.useAuthResetPassword.form.email.value;
					this.useAuthResetPassword.resetForm();

					useRouter().push({
						name: "login",
						query: {
							email,
						},
					});
				}
			});
		},
		goToLogin() {
			useRouter().push({
				name: "login",
			});
		},
	},
});
</script>

<template>
	<div class="wrapper-reset-password">
		<div class="wrapper-reset-password__header">
			<AtomsTypography
				type="title-h7"
				class="wrapper-login__title"
				text="Redefinir senha"
				weight="medium"
				color="var(--brand-color-dark-blue-600)"
			/>
		</div>
		<div class="wrapper-reset-password__main">
			<MoleculesInputCommon
				label="Endereço de e-mail"
				:value="useAuthResetPassword.form.email.value"
				:message-error="useAuthResetPassword.form.email.errorMessage.toString()"
				@on-input="useAuthResetPassword.setEmail"
			/>
			<MoleculesInputPassword
				label="Nova Senha"
				:value="useAuthResetPassword.form.password.value"
				:message-error="
					useAuthResetPassword.form.password.errorMessage.toString()
				"
				@oninput="useAuthResetPassword.setPassword"
				@onkeyup-enter="useAuthResetPassword.setPassword"
			/>
			<MoleculesInputPassword
				label="Confirmar Senha"
				:value="useAuthResetPassword.form.password_confirmation.value"
				:message-error="
					useAuthResetPassword.form.password_confirmation.errorMessage.toString()
				"
				@oninput="useAuthResetPassword.setPasswordConfirmation"
				@onkeyup-enter="useAuthResetPassword.setPasswordConfirmation"
			/>
		</div>
		<div class="wrapper-reset-password__footer">
			<MoleculesButtonsCommon
				text="Redefinir Senha"
				@onclick="handleResetPassword()"
			/>
			<MoleculesButtonsCommon
				type="secondary"
				text="Voltar"
				@onclick="goToLogin()"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
