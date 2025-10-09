<script setup lang="ts">
import AtomsTypography from "@/components/atoms/Typography/index.vue";
import MoleculesInputCommon from "@/components/molecules/Input/Common/index.vue";
import $style from "./styles.module.scss";

const user = reactive({
	name: "",
	email: "",
	currentPassword: "",
	newPassword: "",
	phone: "",
	whatsapp: "",
	contactEmail: "",
});

const errors = reactive({
	name: "",
	email: "",
	currentPassword: "",
	newPassword: "",
	phone: "",
	whatsapp: "",
	contactEmail: "",
});
</script>

<template>
	<section :class="$style.container">
		<!-- Cabeçalho da tela -->
		<div :class="$style.header">
			<AtomsTypography
				type="title-h7"
				text="Configurações"
				weight="bold"
				color="var(--gray-900)"
			/>
			<AtomsTypography
				type="text-p3"
				text="Gerencie os dados da conta e informações da operação"
				color="var(--gray-600)"
			/>
		</div>

		<!-- Conta do Usuário -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Conta do usuário"
				weight="medium"
				color="var(--gray-900)"
			/>

			<div :class="$style.formGroup">
				<MoleculesInputCommon
					label="Nome completo"
					:value="user.name"
					:message-error="errors.name"
					@on-input="user.name = $event"
				/>

				<MoleculesInputCommon
					label="E-mail"
					type-input="email"
					:value="user.email"
					:message-error="errors.email"
					@on-input="user.email = $event"
				/>
			</div>
		</section>

		<!-- Alterar senha -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Alterar senha"
				weight="medium"
				color="var(--gray-900)"
			/>

			<div :class="$style.formGroup">
				<MoleculesInputCommon
					label="Senha atual"
					type-input="password"
					:value="user.currentPassword"
					:message-error="errors.currentPassword"
					@on-input="user.currentPassword = $event"
				/>

				<MoleculesInputCommon
					label="Nova senha"
					type-input="password"
					:value="user.newPassword"
					:message-error="errors.newPassword"
					@on-input="user.newPassword = $event"
				/>
			</div>
		</section>

		<!-- Contatos institucionais -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Contatos institucionais"
				weight="medium"
				color="var(--gray-900)"
			/>

			<div :class="$style.formGroup">
				<MoleculesInputCommon
					label="Telefone"
					type-input="text"
					:value="user.phone"
					:message-error="errors.phone"
					@on-input="user.phone = $event"
				/>

				<MoleculesInputCommon
					label="WhatsApp institucional"
					type-input="text"
					:value="user.whatsapp"
					:message-error="errors.whatsapp"
					@on-input="user.whatsapp = $event"
				/>

				<MoleculesInputCommon
					label="E-mail de atendimento"
					type-input="email"
					:value="user.contactEmail"
					:message-error="errors.contactEmail"
					@on-input="user.contactEmail = $event"
				/>
			</div>
		</section>

		<!-- Informações da operação -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Informações da operação"
				weight="medium"
				color="var(--gray-900)"
			/>

			<div :class="$style.infoGroup">
				<p><strong>Cidade/UF:</strong> Governador Valadares/MG</p>
				<p><strong>Fuso horário:</strong> America/Sao_Paulo</p>
			</div>
		</section>
	</section>
</template>
