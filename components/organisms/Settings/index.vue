<script setup lang="ts">
import { reactive } from "vue";
import AtomsTypography from "~/components/atoms/Typography/index.vue";
import MoleculesInputCommon from "~/components/molecules/Input/Common/index.vue";
import MoleculesButtonsCommon from "~/components/molecules/Buttons/Common/Index.vue";
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

const months = [
	{ name: "Janeiro", available: true, fileUrl: "#" },
	{ name: "Fevereiro", available: false },
	{ name: "Março", available: false },
	{ name: "Abril", available: true, fileUrl: "#" },
	{ name: "Maio", available: false },
	{ name: "Junho", available: false },
	{ name: "Julho", available: false },
	{ name: "Agosto", available: false },
	{ name: "Setembro", available: false },
	{ name: "Outubro", available: false },
	{ name: "Novembro", available: false },
	{ name: "Dezembro", available: false },
];

function openExtract(url: string) {
	window.open(url, "_blank");
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
				color="var(--brand-color-dark-blue-900)"
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
				<MoleculesInputCommon
					label="Confirmar nova senha"
					type-input="password"
				/>
			</div>
		</section>

		<!-- Extratos Mensais -->
		<section :class="$style.section">
			<AtomsTypography
				type="text-p2"
				text="Extratos Mensais"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>

			<div :class="$style.extractGrid">
				<div
					v-for="month in months"
					:key="month.name"
					:class="$style.extractItem"
				>
					<AtomsTypography
						type="text-p4"
						:text="month.name"
						color="var(--brand-color-dark-blue-900)"
					/>

					<AtomsTypography
						v-if="month.available"
						type="text-p5"
						text="Disponível"
						color="var(--brand-color-success-700)"
					/>

					<MoleculesButtonsCommon
						v-if="month.available"
						text="Visualizar PDF"
						type="secondary"
						width="100%"
						name-icon-right="download"
						:icon-right="true"
						@onclick="openExtract(month.fileUrl)"
					/>
				</div>
			</div>
		</section>
	</div>
</template>
