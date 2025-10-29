<script lang="ts">
import { defineComponent, ref, computed, type PropType } from "vue";

export default defineComponent({
	name: "MoleculesFormsBankingData",
	props: {
		// Configuração
		showCpfCnpj: {
			type: Boolean,
			default: true,
		},
		// Valores dos campos
		cpfCnpjValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		accountTypeValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: null,
		},
		pixKeyValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		bankAccountTypeValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | IOption | null
			>,
			default: null,
		},
		bankValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		agencyValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		accountNumberValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		accountHolderValue: {
			type: [String, Number, Boolean, Array, Object] as PropType<
				string | number | boolean | string[] | null
			>,
			default: "",
		},
		// Erros
		cpfCnpjError: {
			type: String,
			default: "",
		},
		accountTypeError: {
			type: String,
			default: "",
		},
		pixKeyError: {
			type: String,
			default: "",
		},
		bankAccountTypeError: {
			type: String,
			default: "",
		},
		bankError: {
			type: String,
			default: "",
		},
		agencyError: {
			type: String,
			default: "",
		},
		accountNumberError: {
			type: String,
			default: "",
		},
		accountHolderError: {
			type: String,
			default: "",
		},
	},
	emits: [
		"update:cpfCnpj",
		"update:accountType",
		"update:pixKey",
		"update:bankAccountType",
		"update:bank",
		"update:agency",
		"update:accountNumber",
		"update:accountHolder",
	],
	setup(props, { emit }) {
		const cpfCnpj = ref(String(props.cpfCnpjValue || ""));
		const selectedAccountType = ref<string | null>(
			String(props.accountTypeValue || ""),
		);

		const accountTypeOptions = [
			{ id: "pix", text: "PIX", state: "default" as const },
			{ id: "bank_account", text: "Conta Bancária", state: "default" as const },
		];

		const bankAccountTypeOptions = [
			{ id: "checking", text: "Conta Corrente", state: "default" as const },
			{ id: "savings", text: "Conta Poupança", state: "default" as const },
		];

		const maskedCpfCnpj = computed(() => {
			const value = String(cpfCnpj.value || "");
			return value ? useMaskDocument(value) : "";
		});

		const handleCpfCnpjInput = (value: string) => {
			const unmasked = useUnmaskDocument(value);
			cpfCnpj.value = unmasked;
			emit("update:cpfCnpj", unmasked);
		};

		const handleAccountTypeSelect = (option: IOption) => {
			selectedAccountType.value = option.id as string;
			emit("update:accountType", option.id);
		};

		const handleBankAccountTypeSelect = (option: IOption) => {
			emit("update:bankAccountType", option);
		};

		// Computed values para garantir tipagem string
		const pixKeyStr = computed(() => String(props.pixKeyValue || ""));
		const bankStr = computed(() => String(props.bankValue || ""));
		const agencyStr = computed(() => String(props.agencyValue || ""));
		const accountNumberStr = computed(() =>
			String(props.accountNumberValue || ""),
		);
		const accountHolderStr = computed(() =>
			String(props.accountHolderValue || ""),
		);

		return {
			cpfCnpj,
			maskedCpfCnpj,
			selectedAccountType,
			accountTypeOptions,
			bankAccountTypeOptions,
			handleCpfCnpjInput,
			handleAccountTypeSelect,
			handleBankAccountTypeSelect,
			pixKeyStr,
			bankStr,
			agencyStr,
			accountNumberStr,
			accountHolderStr,
		};
	},
});
</script>

<template>
	<section class="banking-data">
		<div class="banking-data__header">
			<AtomsTypography
				type="text-p2"
				text="Dados bancários"
				weight="medium"
				color="var(--brand-color-dark-blue-900)"
			/>
		</div>
		<div class="banking-data__content">
			<div class="banking-data__content--group">
				<MoleculesInputCommon
					v-if="showCpfCnpj"
					label="CPF/CNPJ"
					max-width="35%"
					:maxlength="18"
					:value="maskedCpfCnpj"
					:message-error="cpfCnpjError"
					@on-input="handleCpfCnpjInput"
				/>
				<MoleculesSelectsSimple
					:max-width="showCpfCnpj ? '35%' : '50%'"
					label="Tipo de conta"
					:options="accountTypeOptions"
					:message-error="accountTypeError"
					@item-selected="handleAccountTypeSelect"
				/>
			</div>

			<!-- Campo PIX -->
			<div
				v-if="selectedAccountType === 'pix'"
				class="banking-data__content--group"
			>
				<MoleculesInputCommon
					label="Chave PIX"
					max-width="50%"
					:value="pixKeyStr"
					:message-error="pixKeyError"
					@on-input="$emit('update:pixKey', $event)"
				/>
			</div>

			<!-- Campos Conta Bancária -->
			<template v-if="selectedAccountType === 'bank_account'">
				<div class="banking-data__content--group">
					<MoleculesSelectsSimple
						max-width="35%"
						label="Tipo de conta"
						:options="bankAccountTypeOptions"
						:message-error="bankAccountTypeError"
						@item-selected="handleBankAccountTypeSelect"
					/>
					<MoleculesInputCommon
						label="Banco"
						max-width="65%"
						:value="bankStr"
						:message-error="bankError"
						@on-input="$emit('update:bank', $event)"
					/>
				</div>
				<div class="banking-data__content--group">
					<MoleculesInputCommon
						label="Agência"
						max-width="25%"
						:value="agencyStr"
						:message-error="agencyError"
						@on-input="$emit('update:agency', $event)"
					/>
					<MoleculesInputCommon
						label="Número da conta"
						max-width="25%"
						:value="accountNumberStr"
						:message-error="accountNumberError"
						@on-input="$emit('update:accountNumber', $event)"
					/>
					<MoleculesInputCommon
						label="Titular da conta"
						max-width="50%"
						:value="accountHolderStr"
						:message-error="accountHolderError"
						@on-input="$emit('update:accountHolder', $event)"
					/>
				</div>
			</template>
		</div>
	</section>
</template>

<style scoped lang="scss">
.banking-data {
	display: flex;
	flex-direction: column;
	gap: 24px;
	background-color: var(--white);
	border-radius: 4px;
	padding: 24px;
	width: 100%;
	min-height: 268px;

	&__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;

		&--group {
			display: flex;
			flex-direction: row;
			gap: 16px;
			width: 100%;
		}
	}
}
</style>
