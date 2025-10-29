<script setup lang="ts">
import { onMounted } from "vue";
import $style from "./styles.module.scss";
import { useSettingsStore } from "~/stores/settings/useSettingsStore";

defineOptions({
	name: "SettingsPanel",
});

const settingsStore = useSettingsStore();

onMounted(() => {
	settingsStore.fetchUserData();
});

async function handlePasswordChange() {
	if (settingsStore.isLoadingPassword) {
		return;
	}

	const success = await settingsStore.updatePassword();

	if (success) {
		alert("✅ Senha alterada com sucesso!");
	}
}
</script>

<template>
	<div :class="$style.settings">
		<!-- Conta do Usuário -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Conta do usuário"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div :class="$style.formGroup">
				<MoleculesInputCommon
					label="Nome completo"
					:value="settingsStore.userName"
					:disabled="true"
				/>

				<MoleculesInputCommon
					label="E-mail"
					type-input="email"
					:value="settingsStore.userEmail"
					:disabled="true"
				/>
			</div>
		</section>

		<!-- Alterar senha -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Alterar senha"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div :class="$style.formGroup">
				<MoleculesInputCommon
					label="Senha atual"
					type-input="password"
					:value="settingsStore.passwordForm.current_password"
					:message-error="
						settingsStore.passwordErrors.current_password.join(', ')
					"
					@on-input="settingsStore.setPasswordField('current_password', $event)"
				/>
				<MoleculesInputCommon
					label="Nova senha"
					type-input="password"
					:value="settingsStore.passwordForm.new_password"
					:message-error="settingsStore.passwordErrors.new_password.join(', ')"
					@on-input="settingsStore.setPasswordField('new_password', $event)"
				/>

				<MoleculesInputCommon
					label="Confirmar nova senha"
					type-input="password"
					:value="settingsStore.passwordForm.confirm_password"
					:message-error="
						settingsStore.passwordErrors.confirm_password.join(', ')
					"
					@on-input="settingsStore.setPasswordField('confirm_password', $event)"
				/>
			</div>

			<MoleculesButtonsCommon
				text="Salvar nova senha"
				type="primary"
				width="200px"
				:state="settingsStore.isLoadingPassword ? 'loading' : 'default'"
				:disabled="settingsStore.isLoadingPassword"
				@onclick="handlePasswordChange"
			/>
		</section>
	</div>
</template>
