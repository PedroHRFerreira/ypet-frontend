<script lang="ts">
import { defineComponent } from "vue";
import { useAuthLoginStore } from "~/stores/auth/useAuthLoginStore";

export default defineComponent({
	name: "OrganismsAuthLogin",
	setup() {
		const useAuthLogin = useAuthLoginStore();

		return {
			useAuthLogin,
		};
	},
	computed: {
		linkCtaForgotPassword() {
			return {
				text: "Esqueceu a senha?",
				to: {
					name: "forgot-password",
				},
			};
		},
	},
	methods: {
		handleLogin(): void {
			this.useAuthLogin.login().then((res: boolean) => {
				if (res) {
					useRouter().push({
						name: "home",
					});
				}
			});
		},
		goToForgotPassword(): void {
			useRouter().push({
				name: "forgot-password",
			});
		},
	},
});
</script>

<template>
	<div class="wrapper-login">
		<div class="wrapper-login__header">
			<AtomsTypography
				type="title-h7"
				class="wrapper-login__title"
				text="Bem vindo de volta!"
				weight="medium"
				color="var(--brand-color-dark-blue-600)"
			/>
		</div>
		<MoleculesInputCommon
			label="Endereço de e-mail"
			:value="useAuthLogin.form.email.value"
			:message-error="useAuthLogin.form.email.errorMessage.toString()"
			@on-input="useAuthLogin.setEmail"
		/>
		<MoleculesInputPassword
			label="Senha"
			:link-cta="linkCtaForgotPassword.to.name"
			:link-cta-label="linkCtaForgotPassword.text"
			:value="useAuthLogin.form.password.value"
			:message-error="useAuthLogin.form.password.errorMessage.toString()"
			@oninput="useAuthLogin.setPassword"
			@onkeyup-enter="useAuthLogin.setPassword"
			@click-link-cta="goToForgotPassword"
		/>
		<div class="wrapper-login__checkbox">
			<MoleculesInputCheckbox
				label="Me mantenha conectado"
				:model-value="useAuthLogin.form.rememberMe.value"
				@update:model-value="useAuthLogin.setRememberMe"
			/>
		</div>
		<MoleculesButtonsCommon text="Entrar" @onclick="handleLogin()" />
	</div>
</template>

<style scoped lang="scss">
@use "styles.module";
</style>
